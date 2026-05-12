import React, { useState, useMemo, useEffect, useRef } from 'react'; // 🔴 Import useEffect
import { motion } from 'framer-motion';
import {
    FaChartLine, FaHistory, FaTrophy, FaClock,
    FaHeadphones, FaMicrophone, FaBookReader, FaPenNib,
    FaSearch, FaEye, FaStar, FaMedal, FaCrown, FaTicketAlt, FaSpinner, FaChevronLeft, FaChevronRight // 🔴 Import thêm Icon Spinner và Pagination
} from 'react-icons/fa';
import { toast } from 'react-toastify'; // 🔴 Import Toast để show lỗi

// Import các component common (Giả định vẫn giữ nguyên)
import Button from '../../../components/common/Button';
import InputField from '../../../components/common/InputField';
import testResultService from '../../../api/testResultService'; // 🔴 Import Service gọi API
import { useLocation, useNavigate } from 'react-router-dom';

// --- MOCK DATA GIỮ NGUYÊN CHO BIỂU ĐỒ KỸ NĂNG (Vì API chưa có phần này) ---
const SKILL_STATS = [
    { id: 'listening', label: 'Listening', accuracy: 78, icon: FaHeadphones, color: 'text-blue-500', bg: 'bg-blue-500', bgLight: 'bg-blue-50' },
    { id: 'reading', label: 'Reading', accuracy: 65, icon: FaBookReader, color: 'text-emerald-500', bg: 'bg-emerald-500', bgLight: 'bg-emerald-50' },
    { id: 'speaking', label: 'Speaking', accuracy: 45, icon: FaMicrophone, color: 'text-orange-500', bg: 'bg-orange-500', bgLight: 'bg-orange-50' },
    { id: 'writing', label: 'Writing', accuracy: 60, icon: FaPenNib, color: 'text-purple-500', bg: 'bg-purple-500', bgLight: 'bg-purple-50' },
];

// 🔴 XÓA HISTORY_DATA MOCK ĐI VÌ ĐÃ DÙNG API

// --- SUB-COMPONENTS ---

const LevelBadge = ({ score }) => {
    let level = { label: 'Sơ cấp', color: 'text-slate-600', bg: 'bg-slate-100', icon: FaStar };
    if (score >= 450 && score < 750) level = { label: 'Trung cấp', color: 'text-blue-600', bg: 'bg-blue-100', icon: FaMedal };
    if (score >= 750) level = { label: 'Nâng cao', color: 'text-yellow-600', bg: 'bg-yellow-100', icon: FaCrown };

    const Icon = level.icon;

    return (
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${level.bg} ${level.color} text-xs font-bold uppercase tracking-wide w-fit`}>
            <Icon /> {level.label}
        </div>
    );
};

// 🔴 Cập nhật lại field mapping cho Chart để khớp với DTO Backend
const ScoreHistoryChart = ({ data }) => {
    const chartData = [...data]
        .slice(0, 7)
        .reverse();

    return (
        <div className="relative mt-4">
            <div className="absolute inset-0 flex flex-col justify-between text-[10px] text-slate-300 pointer-events-none pb-6 pl-2 pr-2">
                {[100, 75, 50, 25, 0].map((percent) => (
                    <div key={percent} className="border-b border-slate-100 w-full h-0 flex items-center"></div>
                ))}
            </div>

            <div className="flex items-end justify-between gap-2 h-64 px-2 pb-2 relative z-10">
                {chartData.map((item, index) => {
                    // 🔴 Đổi item.score thành item.totalScore
                    const heightPercent = ((item.totalScore || 0) / 990) * 100;
                    const isLatest = index === chartData.length - 1;

                    // 🔴 Format lại chuỗi ngày từ DB (VD: 2024-05-12T... -> 12/05)
                    const dateObj = new Date(item.createdAt);
                    const formattedDate = `${String(dateObj.getDate()).padStart(2, '0')}/${String(dateObj.getMonth() + 1).padStart(2, '0')}`;

                    return (
                        <div key={index} className="flex flex-col items-center justify-end h-full w-full group cursor-pointer">
                            <div className="relative w-full max-w-[40px] h-[85%] rounded-xl bg-slate-50 border border-slate-100 flex items-end justify-center overflow-visible hover:shadow-md transition-all">

                                {/* 🔴 Đổi item.title thành item.testTitle */}
                                <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-slate-800 text-white text-[10px] py-1.5 px-3 rounded-lg shadow-xl arrow-bottom whitespace-nowrap z-50 pointer-events-none transform translate-y-2 group-hover:translate-y-0">
                                    {item.testTitle}
                                </div>

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
                                    <div className={`absolute -top-8 left-1/2 -translate-x-1/2 font-bold transition-all duration-300
                                        ${isLatest
                                            ? 'text-emerald-600 text-sm bg-white px-2 py-0.5 rounded-full shadow-sm border border-emerald-100'
                                            : 'text-slate-400 text-xs group-hover:text-emerald-500 group-hover:-translate-y-1'
                                        }
                                    `}>
                                        {item.totalScore} {/* 🔴 Đổi thành totalScore */}
                                    </div>
                                </motion.div>
                            </div>

                            <div className={`mt-3 text-[10px] font-bold px-2 py-1 rounded-full transition-colors
                                ${isLatest ? 'bg-emerald-50 text-emerald-600' : 'text-slate-400 group-hover:bg-slate-50 group-hover:text-slate-600'}
                            `}>
                                {formattedDate} {/* 🔴 Hiển thị ngày đã format */}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// 🔴 1. HÀM HELPER: LẤY NGÀY ĐẦU TUẦN VÀ CUỐI TUẦN HIỆN TẠI (Định dạng YYYY-MM-DD)
const getCurrentWeekRange = () => {
    const curr = new Date();
    // Tính ngày Thứ 2 của tuần
    const first = curr.getDate() - curr.getDay() + (curr.getDay() === 0 ? -6 : 1);
    const last = first + 6; // Tính ngày Chủ Nhật

    const start = new Date(new Date().setDate(first));
    const end = new Date(new Date().setDate(last));

    // Format về dạng chuỗi YYYY-MM-DD cho input date
    const formatDate = (date) => {
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    };

    return { start: formatDate(start), end: formatDate(end) };
};

// --- MAIN PAGE ---
const LearnerProgressPage = () => {
    // 🔴 1. KHỞI TẠO LOCATION ĐỂ LẤY STATE ĐƯỢC TRUYỀN SANG
    const location = useLocation();
    const incomingFilter = location.state || {};

    const navigate = useNavigate()

    // 🔴 1. KHAI BÁO REF ĐỂ TRỎ VÀO KHỐI LỊCH SỬ
    const historySectionRef = useRef(null);

    // 🔴 1. KHAI BÁO CÁC STATE QUẢN LÝ DỮ LIỆU TỪ API
    const [historyData, setHistoryData] = useState([]);
    const [loading, setLoading] = useState(true);

    // 🔴 2. KHỞI TẠO STATE VỚI DỮ LIỆU TỪ TRANG TRƯỚC (NẾU CÓ)
    const [testId, setTestId] = useState(incomingFilter.filterTestId || null);
    const [searchTerm, setSearchTerm] = useState(incomingFilter.filterTestTitle || '');

    // 🔴 2. KHAI BÁO STATE NGÀY THÁNG (Mặc định lấy tuần hiện tại)
    const weekRange = getCurrentWeekRange();
    const [startDate, setStartDate] = useState(weekRange.start);
    const [endDate, setEndDate] = useState(weekRange.end);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const USER_GOAL = 800;

    useEffect(() => {
        if (incomingFilter.filterTestId && historySectionRef.current) {
            // Dùng setTimeout (khoảng 300ms) để chờ component render và fetch data xong xuôi rồi mới cuộn cho mượt
            setTimeout(() => {
                historySectionRef.current.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' // Cuộn sao cho mép trên của bảng nằm ở mép trên của màn hình
                });
            }, 300);
        }
    }, [incomingFilter.filterTestId]);

    useEffect(() => {
        let isMounted = true;

        const fetchHistory = async () => {
            try {
                setLoading(true);
                const params = {
                    page: page,
                    size: 10,
                    // 🔴 3. ƯU TIÊN testId NẾU CÓ, KHÔNG THÌ DÙNG searchTerm
                    testId: testId || undefined,
                    testTitle: !testId ? (searchTerm || undefined) : undefined,
                    startDate: startDate || undefined,
                    endDate: endDate || undefined
                };

                const response = await testResultService.getMyTestHistory(params);

                if (isMounted && response.data) {
                    setHistoryData(response.data.content || []);
                    setTotalPages(response.data.totalPages || 1);
                }
            } catch (error) {
                if (isMounted) toast.error(error.message || "Lỗi tải dữ liệu!");
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        const delaySearch = setTimeout(fetchHistory, 500);
        return () => { isMounted = false; clearTimeout(delaySearch); };

        // 🔴 4. THÊM testId VÀO DEPENDENCY
    }, [page, searchTerm, startDate, endDate, testId]);

    // 🔴 5. KHI USER GÕ VÀO Ô SEARCH, PHẢI XÓA testId ĐI ĐỂ TÌM THEO TITLE
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setTestId(null); // 🔴 Xóa filter theo ID vì user đang gõ tự do
        setPage(1);
    };

    // 🔴 Thêm hàm reset page khi đổi ngày
    const handleDateChange = (setter) => (e) => {
        setter(e.target.value);
        setPage(1);
    };

    // --- LOGIC TÍNH TOÁN DỰA TRÊN DỮ LIỆU THẬT ---

    const estimatedScore = useMemo(() => {
        // Lấy 5 bài gần nhất (Backend mặc định trả về mới nhất trước)
        const recentTests = historyData.slice(0, 5);
        if (recentTests.length === 0) return 0;

        // 🔴 Sửa thành item.totalScore
        const totalSum = recentTests.reduce((acc, curr) => acc + (curr.totalScore || 0), 0);
        return Math.round(totalSum / recentTests.length);
    }, [historyData]);

    const isGoalReached = estimatedScore >= USER_GOAL;
    const progressToGoal = Math.min((estimatedScore / USER_GOAL) * 100, 100);

    const currentLevelInfo = useMemo(() => {
        if (estimatedScore < 450) return { name: 'Sơ cấp (Beginner)', percent: 30, color: 'bg-slate-400', range: '0 - 450' };
        if (estimatedScore < 750) return { name: 'Trung cấp (Intermediate)', percent: 65, color: 'bg-blue-500', range: '450 - 750' };
        return { name: 'Nâng cao (Advanced)', percent: 90, color: 'bg-yellow-500', range: '750 - 990' };
    }, [estimatedScore]);


    return (
        <div className="min-h-screen bg-transparent pb-20 space-y-8">
            {/* Header ... (Giữ nguyên) */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Tiến độ học tập</h1>
                    <p className="text-slate-500 mt-2 text-sm max-w-2xl">
                        Theo dõi sự tiến bộ của bạn qua từng bài kiểm tra. Dữ liệu được cập nhật dựa trên kết quả làm bài thực tế.
                    </p>
                </div>
            </div>

            {/* Overviews ... (Giữ nguyên) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Card 1: Trình độ hiện tại (Giữ nguyên) */}
                <div className="bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm relative overflow-hidden flex flex-col justify-between">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <FaTrophy className="text-8xl text-slate-800" />
                    </div>

                    <div>
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Trình độ hiện tại</h3>
                        <div className={`text-3xl font-extrabold tracking-tight ${currentLevelInfo.color.replace('bg-', 'text-')}`}>
                            {currentLevelInfo.name}
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-3 gap-2">
                        {[
                            { label: 'Sơ cấp', min: 0, max: 450, color: 'bg-slate-500', activeBorder: 'border-slate-500' },
                            { label: 'Trung cấp', min: 450, max: 750, color: 'bg-blue-500', activeBorder: 'border-blue-500' },
                            { label: 'Nâng cao', min: 750, max: 990, color: 'bg-yellow-500', activeBorder: 'border-yellow-500' }
                        ].map((level, index) => {
                            const isActive = estimatedScore >= level.min && (index === 2 || estimatedScore < level.max);
                            return (
                                <div key={index} className={`relative flex flex-col items-center justify-center py-3 rounded-xl border-2 transition-all duration-300 ${isActive ? `${level.activeBorder} bg-white shadow-md transform -translate-y-1` : 'border-transparent bg-slate-50 opacity-50'}`}>
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

                {/* Card 2 & 3 ... (Giữ nguyên cấu trúc) */}
                {/* (Phần UI Card Mục Tiêu & Card Thống Kê giữ nguyên y hệt Code của bạn) */}
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
                    <div className="mt-4 pt-4 border-t border-white/20">
                        {isGoalReached ? (
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-white font-bold animate-pulse">
                                    <FaCrown className="text-yellow-300 text-xl" />
                                    <span>Bạn đã sẵn sàng thi thật!</span>
                                </div>
                                <p className="text-xs text-emerald-100 opacity-90">
                                    Điểm ước lượng của bạn đã vượt qua mục tiêu <strong>{USER_GOAL}</strong>. Hãy đăng ký thi ngay để đạt kết quả tốt nhất.
                                </p>
                            </div>
                        ) : (
                            <div>
                                <div className="flex justify-between text-xs font-bold text-emerald-100 mb-1.5">
                                    <span>Mục tiêu: {USER_GOAL}</span>
                                    <span>Còn thiếu: {USER_GOAL - estimatedScore}đ</span>
                                </div>
                                <div className="w-full bg-black/20 h-2 rounded-full overflow-hidden">
                                    <motion.div initial={{ width: 0 }} animate={{ width: `${progressToGoal}%` }} transition={{ duration: 1 }} className="h-full bg-white/90 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-5 rounded-[1.5rem] border border-slate-100 shadow-sm flex flex-col justify-center items-center text-center">
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-2"><FaHistory /></div>
                        {/* 🔴 Hiện tại stat này mình chưa có API đếm tổng, tạm để logic mảng */}
                        <span className="text-2xl font-bold text-slate-800">{historyData.length}</span>
                        <span className="text-xs text-slate-400 uppercase font-bold">Đề hiển thị</span>
                    </div>
                    <div className="bg-white p-5 rounded-[1.5rem] border border-slate-100 shadow-sm flex flex-col justify-center items-center text-center">
                        <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mb-2"><FaClock /></div>
                        <span className="text-2xl font-bold text-slate-800">...</span>
                        <span className="text-xs text-slate-400 uppercase font-bold">Giờ học</span>
                    </div>
                </div>
            </div>

            {/* CHART & SKILLS SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <FaChartLine className="text-emerald-500" /> Biểu đồ điểm số
                        </h3>
                    </div>
                    {/* 🔴 Truyền dữ liệu thật vào Component Chart */}
                    {!loading && historyData.length > 0 ? (
                        <ScoreHistoryChart data={historyData} />
                    ) : (
                        <div className="h-64 flex items-center justify-center text-slate-400 text-sm">
                            {loading ? <FaSpinner className="animate-spin text-2xl" /> : "Chưa có dữ liệu vẽ biểu đồ."}
                        </div>
                    )}
                </div>

                <div className="bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <FaStar className="text-yellow-400" /> Tỷ lệ chính xác
                    </h3>
                    {/* SKILL_STATS Giữ nguyên */}
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
                                    <motion.div initial={{ width: 0 }} whileInView={{ width: `${skill.accuracy}%` }} transition={{ duration: 0.8 }} className={`h-full rounded-full ${skill.bg}`} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* HISTORY TABLE SECTION */}
            <div ref={historySectionRef} className="bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm">

                {/* 🔴 HEADER CỦA BẢNG */}
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-6">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 whitespace-nowrap">
                        <FaHistory className="text-slate-400" /> Lịch sử chi tiết
                    </h3>

                    {/* Bộ công cụ Lọc */}
                    <div className="flex flex-col md:flex-row gap-3 w-full xl:w-auto">

                        {/* THÔNG BÁO ĐANG LỌC THEO BÀI TEST */}
                        {testId && (
                            <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-xl text-xs font-bold border border-emerald-100 w-fit">
                                Đang lọc theo bài đã chọn
                                <button onClick={() => setTestId(null)} className="hover:text-red-500 transition-colors">
                                    &times;
                                </button>
                            </div>
                        )}

                        {/* Cụm Từ ngày - Đến ngày */}
                        <div className="flex items-center gap-2">
                            <input
                                type="date"
                                value={startDate}
                                onChange={handleDateChange(setStartDate)}
                                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all w-full md:w-auto"
                            />
                            <span className="text-slate-400 font-bold">-</span>
                            <input
                                type="date"
                                value={endDate}
                                onChange={handleDateChange(setEndDate)}
                                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all w-full md:w-auto"
                            />
                        </div>

                        {/* Ô Search */}
                        <div className="w-full md:w-72">
                            <InputField
                                placeholder="Tìm bài thi..."
                                icon={FaSearch}
                                value={searchTerm}
                                onChange={handleSearchChange}
                                size="compact"
                                className="!mb-0"
                            />
                        </div>
                    </div>
                </div>

                {/* 🔴 LOGIC RENDER NỘI DUNG (LOADING / TABLE / EMPTY / PAGINATION) */}
                {loading ? (
                    // 1. Nếu đang Loading -> Chỉ hiện Spinner, giấu hết bảng
                    <div className="py-20 flex flex-col items-center justify-center text-emerald-500 gap-3">
                        <FaSpinner className="animate-spin text-4xl" />
                        <span className="text-sm text-slate-400 font-medium animate-pulse">Đang tải dữ liệu...</span>
                    </div>
                ) : (
                    // 2. Nếu đã Load xong -> Hiện khối dữ liệu
                    <div className="overflow-x-auto relative">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left border-b border-slate-100">
                                    <th className="pb-3 text-xs font-bold text-slate-400 uppercase pl-4">Bài thi</th>
                                    <th className="pb-3 text-xs font-bold text-slate-400 uppercase">Ngày</th>
                                    <th className="pb-3 text-xs font-bold text-slate-400 uppercase">Điểm số</th>
                                    <th className="pb-3 text-xs font-bold text-slate-400 uppercase text-right pr-4">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {historyData.map((item) => (
                                    <tr key={item.id} className="group hover:bg-slate-50/80 transition-colors">
                                        <td className="py-4 pl-4">
                                            <div className="font-bold text-slate-700 group-hover:text-emerald-600 transition-colors">
                                                {item.testTitle}
                                            </div>
                                            <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                                                <FaClock size={10} /> {Math.round(item.timeTakenSeconds / 60)} phút
                                            </div>
                                        </td>
                                        <td className="py-4 text-sm text-slate-500 font-medium">
                                            {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                                        </td>
                                        <td className="py-4">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-slate-800 text-lg">{item.totalScore}</span>
                                                <span className="text-xs text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">/990</span>
                                            </div>
                                        </td>
                                        <td className="py-4 pr-4">
                                            <div className="flex items-center justify-end">
                                                <Button
                                                    variant="outline"
                                                    className="!px-3 !py-1.5 !text-[11px] !font-bold !rounded-lg !border-slate-200 !text-slate-500 hover:!border-emerald-500 hover:!text-emerald-600 hover:!bg-white !shadow-none hover:!shadow-sm transition-all"
                                                    onClick={() => navigate(`/test-results/${item.id}/review`)}
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

                        {/* 🔴 Empty State: Nằm BÊN TRONG thẻ div bọc bảng, chỉ hiện khi mảng rỗng */}
                        {historyData.length === 0 && (
                            <div className="text-center py-12 flex flex-col items-center border-t border-slate-50 mt-2">
                                <div className="text-4xl mb-3 opacity-30 grayscale">📂</div>
                                <p className="text-slate-500 text-sm font-bold">Không tìm thấy bài thi nào</p>
                                <p className="text-slate-400 text-xs mt-1">Hãy thử thay đổi thời gian hoặc từ khóa tìm kiếm.</p>
                            </div>
                        )}

                        {/* 🔴 Phân trang: Nằm BÊN TRONG thẻ div bọc bảng, chỉ hiện khi có > 1 trang */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-2 px-4">
                                <span className="text-xs text-slate-400 font-medium">
                                    Trang <strong className="text-slate-600">{page}</strong> / {totalPages}
                                </span>
                                <div className="flex gap-2">
                                    <button
                                        disabled={page === 1}
                                        onClick={() => setPage(p => p - 1)}
                                        className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <FaChevronLeft size={12} />
                                    </button>
                                    <button
                                        disabled={page === totalPages}
                                        onClick={() => setPage(p => p + 1)}
                                        className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <FaChevronRight size={12} />
                                    </button>
                                </div>
                            </div>
                        )}

                    </div>
                )}
            </div>
        </div>
    );
};

export default LearnerProgressPage;