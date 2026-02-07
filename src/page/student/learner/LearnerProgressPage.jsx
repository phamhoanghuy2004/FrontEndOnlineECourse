import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    FaChartLine, FaHistory, FaTrophy, FaClock,
    FaHeadphones, FaMicrophone, FaBookReader, FaPenNib,
    FaSearch, FaEye, FaStar, FaMedal, FaCrown, FaTicketAlt
} from 'react-icons/fa';

// Import các component common (Giả định vẫn giữ nguyên)
import Button from '../../../components/common/Button';
import InputField from '../../../components/common/InputField';

// --- MOCK DATA ---
const SKILL_STATS = [
    { id: 'listening', label: 'Listening', accuracy: 78, icon: FaHeadphones, color: 'text-blue-500', bg: 'bg-blue-500', bgLight: 'bg-blue-50' },
    { id: 'reading', label: 'Reading', accuracy: 65, icon: FaBookReader, color: 'text-emerald-500', bg: 'bg-emerald-500', bgLight: 'bg-emerald-50' },
    { id: 'speaking', label: 'Speaking', accuracy: 45, icon: FaMicrophone, color: 'text-orange-500', bg: 'bg-orange-500', bgLight: 'bg-orange-50' },
    { id: 'writing', label: 'Writing', accuracy: 60, icon: FaPenNib, color: 'text-purple-500', bg: 'bg-purple-500', bgLight: 'bg-purple-50' },
];

const HISTORY_DATA = [
    { id: 1, title: 'TOEIC Full Test 2024 - Đề 05', date: '2024-02-05', duration: '118 phút', score: 880, total: 990, status: 'pass' },
    { id: 2, title: 'TOEIC Full Test 2024 - Đề 04', date: '2024-02-04', duration: '115 phút', score: 850, total: 990, status: 'pass' },
    { id: 3, title: 'TOEIC Full Test 2024 - Đề 03', date: '2024-02-01', duration: '110 phút', score: 790, total: 990, status: 'pass' },
    { id: 4, title: 'TOEIC Full Test 2024 - Đề 02', date: '2024-01-28', duration: '120 phút', score: 720, total: 990, status: 'pass' },
    { id: 5, title: 'TOEIC Full Test 2024 - Đề 01', date: '2024-01-25', duration: '115 phút', score: 650, total: 990, status: 'pass' },
    { id: 6, title: 'Mini Test: Listening Part 1', date: '2024-01-20', duration: '15 phút', score: 4, total: 10, status: 'fail' },
];

// --- SUB-COMPONENTS ---

// 1. Level Badge Logic
const LevelBadge = ({ score }) => {
    let level = { label: 'Sơ cấp', color: 'text-slate-600', bg: 'bg-slate-100', icon: FaStar };
    if (score >= 450 && score < 750) level = { label: 'Trung cấp', color: 'text-blue-600', bg: 'bg-blue-100', icon: FaMedal };
    if (score >= 750) level = { label: 'Nâng cao', color: 'text-yellow-600', bg: 'bg-yellow-100', icon: FaCrown };

    const Icon = level.icon;

    return (
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${level.bg} ${level.color} text-xs font-bold uppercase tracking-wide`}>
            <Icon /> {level.label}
        </div>
    );
};

// 2. Score Bar Chart Component (Phiên bản UI nâng cấp)
const ScoreHistoryChart = ({ data }) => {
    // Lấy dữ liệu và đảo ngược như cũ
    const chartData = [...data]
        .filter(item => item.total === 990)
        .slice(0, 7)
        .reverse();

    return (
        <div className="relative mt-4">
            {/* 1. BACKGROUND GRID LINES (Tạo dòng kẻ mờ để đỡ trống) */}
            <div className="absolute inset-0 flex flex-col justify-between text-[10px] text-slate-300 pointer-events-none pb-6 pl-2 pr-2">
                {[100, 75, 50, 25, 0].map((percent) => (
                    <div key={percent} className="border-b border-slate-100 w-full h-0 flex items-center">
                        {/* Nếu muốn hiển thị số mốc bên trái thì uncomment dòng dưới */}
                        {/* <span className="-ml-8 absolute">{Math.round(990 * (percent/100))}</span> */}
                    </div>
                ))}
            </div>

            {/* 2. MAIN CHART AREA */}
            <div className="flex items-end justify-between gap-2 h-64 px-2 pb-2 relative z-10">
                {chartData.map((item, index) => {
                    const heightPercent = (item.score / 990) * 100;
                    const isLatest = index === chartData.length - 1;

                    return (
                        <div key={index} className="flex flex-col items-center justify-end h-full w-full group cursor-pointer">

                            {/* Cột chứa (Track & Bar) */}
                            <div className="relative w-full max-w-[40px] h-[85%] rounded-xl bg-slate-50 border border-slate-100 flex items-end justify-center overflow-visible hover:shadow-md transition-all">

                                {/* Tooltip hover (Hiện tên bài thi) */}
                                <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-slate-800 text-white text-[10px] py-1.5 px-3 rounded-lg shadow-xl arrow-bottom whitespace-nowrap z-50 pointer-events-none transform translate-y-2 group-hover:translate-y-0">
                                    {item.title}
                                </div>

                                {/* Thanh điểm số (Animated Bar) */}
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${heightPercent}%` }}
                                    transition={{ type: "spring", stiffness: 60, damping: 15, delay: index * 0.1 }}
                                    className={`w-full rounded-xl relative min-h-[8px] 
                                        ${isLatest
                                            ? 'bg-gradient-to-t from-emerald-500 to-emerald-400 shadow-[0_4px_20px_rgba(16,185,129,0.3)]'
                                            : 'bg-slate-300 group-hover:bg-emerald-300 transition-colors duration-300'
                                        }`}
                                >
                                    {/* Số điểm nổi lên trên cột */}
                                    <div className={`absolute -top-8 left-1/2 -translate-x-1/2 font-bold transition-all duration-300
                                        ${isLatest
                                            ? 'text-emerald-600 text-sm bg-white px-2 py-0.5 rounded-full shadow-sm border border-emerald-100'
                                            : 'text-slate-400 text-xs group-hover:text-emerald-500 group-hover:-translate-y-1'
                                        }
                                    `}>
                                        {item.score}
                                    </div>
                                </motion.div>
                            </div>

                            {/* Ngày tháng (Styled lại cho đẹp) */}
                            <div className={`mt-3 text-[10px] font-bold px-2 py-1 rounded-full transition-colors
                                ${isLatest ? 'bg-emerald-50 text-emerald-600' : 'text-slate-400 group-hover:bg-slate-50 group-hover:text-slate-600'}
                            `}>
                                {item.date.split('-').slice(1).join('/')}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// --- MAIN PAGE ---
const LearnerProgressPage = () => {
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const USER_GOAL = 800;

    // --- LOGIC TÍNH TOÁN ---

    // 1. Tính điểm TOEIC ước lượng (Trung bình 5 bài test full gần nhất)
    const estimatedScore = useMemo(() => {
        const fullTests = HISTORY_DATA.filter(t => t.total === 990).slice(0, 5);
        if (fullTests.length === 0) return 0;
        const totalScore = fullTests.reduce((acc, curr) => acc + curr.score, 0);
        return Math.round(totalScore / fullTests.length);
    }, []);

    // Logic kiểm tra đạt mục tiêu
    const isGoalReached = estimatedScore >= USER_GOAL;
    const progressToGoal = Math.min((estimatedScore / USER_GOAL) * 100, 100);

    // 2. Xác định Level hiện tại dựa trên điểm ước lượng
    const currentLevelInfo = useMemo(() => {
        if (estimatedScore < 450) return { name: 'Sơ cấp (Beginner)', percent: 30, color: 'bg-slate-400', range: '0 - 450' };
        if (estimatedScore < 750) return { name: 'Trung cấp (Intermediate)', percent: 65, color: 'bg-blue-500', range: '450 - 750' };
        return { name: 'Nâng cao (Advanced)', percent: 90, color: 'bg-yellow-500', range: '750 - 990' };
    }, [estimatedScore]);

    // 3. Filter History
    const filteredHistory = HISTORY_DATA.filter(item => {
        const matchStatus = filterStatus === 'all' || item.status === filterStatus;
        const matchSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
        return matchStatus && matchSearch;
    });

    return (
        <div className="min-h-screen bg-transparent pb-20 space-y-8">

            {/* 1. HEADER SECTION (NEW) */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Tiến độ học tập</h1>
                    <p className="text-slate-500 mt-2 text-sm max-w-2xl">
                        Theo dõi sự tiến bộ của bạn qua từng bài kiểm tra. Dữ liệu được cập nhật dựa trên kết quả làm bài thực tế.
                    </p>
                </div>
                <div className="text-right hidden md:block">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Cập nhật lần cuối</p>
                    <p className="text-sm font-bold text-slate-700">Hôm nay, 10:30 AM</p>
                </div>
            </div>

            {/* 2. OVERVIEW LEVEL & ESTIMATION (NEW SECTION) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Card 1: Trình độ hiện tại (Clean version) */}
                <div className="bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm relative overflow-hidden flex flex-col justify-between">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <FaTrophy className="text-8xl text-slate-800" />
                    </div>

                    <div>
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Trình độ hiện tại</h3>
                        {/* Chỉ hiển thị tên Level thật to */}
                        <div className={`text-3xl font-extrabold tracking-tight ${currentLevelInfo.color.replace('bg-', 'text-')}`}>
                            {currentLevelInfo.name}
                        </div>
                    </div>

                    {/* 3 Khối Cấp Độ (Giữ nguyên logic hiển thị) */}
                    <div className="mt-6 grid grid-cols-3 gap-2">
                        {[
                            { label: 'Sơ cấp', min: 0, max: 450, color: 'bg-slate-500', activeBorder: 'border-slate-500' },
                            { label: 'Trung cấp', min: 450, max: 750, color: 'bg-blue-500', activeBorder: 'border-blue-500' },
                            { label: 'Nâng cao', min: 750, max: 990, color: 'bg-yellow-500', activeBorder: 'border-yellow-500' }
                        ].map((level, index) => {
                            // Logic cũ: xác định ô nào đang active dựa trên điểm ẩn
                            const isActive = estimatedScore >= level.min && (index === 2 || estimatedScore < level.max);

                            return (
                                <div
                                    key={index}
                                    className={`
                        relative flex flex-col items-center justify-center py-3 rounded-xl border-2 transition-all duration-300
                        ${isActive
                                            ? `${level.activeBorder} bg-white shadow-md transform -translate-y-1`
                                            : 'border-transparent bg-slate-50 opacity-50'
                                        }
                    `}
                                >
                                    {isActive && (
                                        <div className={`absolute -top-2.5 bg-white ${level.color.replace('bg-', 'text-')} rounded-full p-0.5 shadow-sm border`}>
                                            <FaMedal size={12} />
                                        </div>
                                    )}

                                    <span className={`text-[10px] font-bold uppercase tracking-wide ${isActive ? 'text-slate-800' : 'text-slate-400'}`}>
                                        {level.label}
                                    </span>

                                    <div className={`h-1 w-8 rounded-full mt-1.5 ${isActive ? level.color : 'bg-slate-200'}`}></div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* --- SỬA CARD 2: DỰ ĐOÁN & MỤC TIÊU --- */}
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-6 rounded-[1.5rem] shadow-lg shadow-emerald-200 text-white relative flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-start">
                            <h3 className="text-emerald-100 text-sm font-bold uppercase tracking-wider">Điểm ước lượng</h3>
                            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                                <FaChartLine className="text-white" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-baseline gap-2">
                            <span className="text-5xl font-extrabold tracking-tighter">{estimatedScore}</span>
                            <span className="text-emerald-100 font-medium">/ 990</span>
                        </div>
                    </div>

                    {/* Footer Card: Logic Mục tiêu */}
                    <div className="mt-4 pt-4 border-t border-white/20">
                        {isGoalReached ? (
                            // TRƯỜNG HỢP 1: ĐÃ ĐẠT MỤC TIÊU
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-white font-bold animate-pulse">
                                    <FaCrown className="text-yellow-300 text-xl" />
                                    <span>Bạn đã sẵn sàng thi thật!</span>
                                </div>
                                <p className="text-xs text-emerald-100 opacity-90">
                                    Điểm ước lượng của bạn đã vượt qua mục tiêu <strong>{USER_GOAL}</strong>. Hãy đăng ký thi ngay để đạt kết quả tốt nhất.
                                </p>
                                <Button
                                    className="!w-full !py-2 !rounded-xl !bg-white !text-emerald-600 !font-bold !text-xs !shadow-md hover:!bg-emerald-50 transition-all"
                                >
                                    <span className="flex items-center justify-center gap-2">
                                        <FaTicketAlt /> Đăng ký thi ngay
                                    </span>
                                </Button>
                            </div>
                        ) : (
                            // TRƯỜNG HỢP 2: CHƯA ĐẠT MỤC TIÊU
                            <div>
                                <div className="flex justify-between text-xs font-bold text-emerald-100 mb-1.5">
                                    <span>Mục tiêu: {USER_GOAL}</span>
                                    <span>Còn thiếu: {USER_GOAL - estimatedScore}đ</span>
                                </div>
                                {/* Progress Bar Mục tiêu */}
                                <div className="w-full bg-black/20 h-2 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progressToGoal}%` }}
                                        transition={{ duration: 1 }}
                                        className="h-full bg-white/90 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                                    />
                                </div>
                                <p className="text-[10px] text-emerald-100 mt-2 text-right italic opacity-80">
                                    Cố lên! Bạn đang đi đúng hướng.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Card 3: Thống kê nhanh (Giữ lại StatCard cũ nhưng gọn hơn) */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-5 rounded-[1.5rem] border border-slate-100 shadow-sm flex flex-col justify-center items-center text-center">
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-2">
                            <FaHistory />
                        </div>
                        <span className="text-2xl font-bold text-slate-800">128</span>
                        <span className="text-xs text-slate-400 uppercase font-bold">Đề đã làm</span>
                    </div>
                    <div className="bg-white p-5 rounded-[1.5rem] border border-slate-100 shadow-sm flex flex-col justify-center items-center text-center">
                        <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mb-2">
                            <FaClock />
                        </div>
                        <span className="text-2xl font-bold text-slate-800">45h</span>
                        <span className="text-xs text-slate-400 uppercase font-bold">Giờ học</span>
                    </div>
                </div>
            </div>

            {/* 3. CHART & SKILLS SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left: Score History Chart (Updated Logic) */}
                <div className="lg:col-span-2 bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <FaChartLine className="text-emerald-500" /> Biểu đồ điểm số
                        </h3>
                        <div className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-md">
                            7 bài Full Test gần nhất
                        </div>
                    </div>
                    {/* Gọi component Chart mới */}
                    <ScoreHistoryChart data={HISTORY_DATA} />
                </div>

                {/* Right: Skill Accuracy (Updated Logic) */}
                <div className="bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <FaStar className="text-yellow-400" /> Tỷ lệ chính xác
                    </h3>

                    <div className="space-y-5">
                        {SKILL_STATS.map((skill) => (
                            <div key={skill.id} className="group">
                                <div className="flex justify-between text-sm mb-1.5">
                                    <span className="flex items-center gap-2 font-bold text-slate-700">
                                        <div className={`p-1.5 rounded-lg ${skill.bgLight} ${skill.color}`}>
                                            <skill.icon size={12} />
                                        </div>
                                        {skill.label}
                                    </span>
                                    <span className="font-bold text-slate-700">{skill.accuracy}%</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        whileInView={{ width: `${skill.accuracy}%` }}
                                        transition={{ duration: 0.8 }}
                                        className={`h-full rounded-full ${skill.bg}`}
                                    />
                                </div>
                                <p className="text-[10px] text-slate-400 mt-1 pl-1">
                                    Dựa trên tổng câu trả lời đúng
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 4. HISTORY TABLE SECTION */}
            <div className="bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm">

                {/* Header: Title + Search (Đã bỏ Filter Tabs) */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <FaHistory className="text-slate-400" /> Lịch sử chi tiết
                    </h3>

                    {/* Chỉ giữ lại thanh Search */}
                    <div className="w-full md:w-72">
                        <InputField
                            placeholder="Tìm kiếm bài thi..."
                            icon={FaSearch}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            size="compact"
                            className="!mb-0" // Bỏ margin bottom thừa của InputField
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left border-b border-slate-100">
                                <th className="pb-3 text-xs font-bold text-slate-400 uppercase pl-4">Bài thi</th>
                                <th className="pb-3 text-xs font-bold text-slate-400 uppercase">Ngày</th>
                                <th className="pb-3 text-xs font-bold text-slate-400 uppercase">Điểm số</th>
                                <th className="pb-3 text-xs font-bold text-slate-400 uppercase">Trình độ</th>
                                {/* Căn phải tiêu đề cột Hành động */}
                                <th className="pb-3 text-xs font-bold text-slate-400 uppercase text-right pr-4">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredHistory.map((item) => (
                                <tr key={item.id} className="group hover:bg-slate-50/80 transition-colors">

                                    {/* Cột Tên Bài Thi */}
                                    <td className="py-4 pl-4">
                                        <div className="font-bold text-slate-700 group-hover:text-emerald-600 transition-colors">
                                            {item.title}
                                        </div>
                                        <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                                            <FaClock size={10} /> {item.duration}
                                        </div>
                                    </td>

                                    {/* Cột Ngày */}
                                    <td className="py-4 text-sm text-slate-500 font-medium">
                                        {item.date}
                                    </td>

                                    {/* Cột Điểm Số */}
                                    <td className="py-4">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-slate-800 text-lg">{item.score}</span>
                                            <span className="text-xs text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">/{item.total}</span>
                                        </div>
                                    </td>

                                    {/* Cột Level Badge */}
                                    <td className="py-4">
                                        <LevelBadge score={item.score} />
                                    </td>

                                    {/* Cột Hành Động (Căn phải tuyệt đối) */}
                                    <td className="py-4 pr-4">
                                        {/* Thêm div bọc với flex justify-end để đẩy nút sang phải */}
                                        <div className="flex items-center justify-end">
                                            <Button
                                                variant="outline"
                                                className="!px-3 !py-1.5 !text-[11px] !font-bold !rounded-lg !border-slate-200 !text-slate-500 hover:!border-emerald-500 hover:!text-emerald-600 hover:!bg-white !shadow-none hover:!shadow-sm transition-all"
                                                onClick={() => console.log('Xem chi tiết', item.id)}
                                            >
                                                <span className="flex items-center gap-1.5">
                                                    <FaEye /> Chi tiết
                                                </span>
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Empty State */}
                    {filteredHistory.length === 0 && (
                        <div className="text-center py-10 flex flex-col items-center">
                            <div className="text-4xl mb-2 opacity-50">📂</div>
                            <p className="text-slate-400 text-sm font-medium">Không tìm thấy bài thi nào.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LearnerProgressPage;