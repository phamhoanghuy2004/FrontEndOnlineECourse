import React, { useState, useEffect } from 'react';
import { FaCheck, FaArrowRight, FaRoute, FaLightbulb, FaFireAlt, FaShieldAlt } from 'react-icons/fa';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';

// 💥 Import cấu hình API và AuthContext (Nhớ trỏ đúng đường dẫn của bạn)
import courseRecommendApi from '../../../api/courseRecommendApi';
import { useAuth } from '../../../hooks/useAuth';

const SuggestedComboPage = () => {
    const navigate = useNavigate();

    // 💥 Rút thông tin user từ AuthContext
    const { user } = useAuth(); 
    const studyGoal = user?.activeGoal; 

    const [insightData, setInsightData] = useState(null);
    const [recommendedCourses, setRecommendedCourses] = useState([]);
    const [selectedCourses, setSelectedCourses] = useState([]);
    
    // 💥 Khai báo state quản lý hiệu ứng Loading và Error
    const [isLoading, setIsLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
        const fetchRecommendations = async () => {
            // Nếu chưa có goal, ngắt luôn không cần gọi API
            if (!studyGoal) {
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                
                // Bắn 2 API song song
                const [insightRes, coursesRes] = await Promise.all([
                    courseRecommendApi.getSkillInsights(),
                    courseRecommendApi.getRecommendedCourses()
                ]);

                // 💥 Rule: Data thành công nằm trong response.data
                const insightPayload = insightRes.data;
                const coursesPayload = coursesRes.data;

                setInsightData(insightPayload);
                const coursesList = coursesPayload || [];
                setRecommendedCourses(coursesList);
                
                // Tự động tick chọn hết lộ trình ban đầu
                setSelectedCourses(coursesList.map(c => c.id)); 

            } catch (err) {
                // 💥 Rule: Thất bại thì err chính là cục data lỗi
                console.error("Lỗi call API lộ trình:", err);
                setErrorMsg(err.message || "Không thể tải lộ trình lúc này. Vui lòng thử lại sau.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchRecommendations();
    }, [studyGoal]);

    const handleToggleCourse = (courseId) => {
        setSelectedCourses(prev => 
            prev.includes(courseId) ? prev.filter(id => id !== courseId) : [...prev, courseId]
        );
    };

    // 💥 THÊM MỚI: Hàm xử lý khi user bấm nút "Mua ngay"
    const handleBuyNow = () => {
        // Chắc cú chặn lại nếu không chọn khóa nào
        if (selectedCourses.length === 0) return; 
        
        // Biến mảng [101, 102] thành chuỗi "101,102"
        const idsString = selectedCourses.join(','); 
        
        // Chuyển hướng sang trang checkout kèm query params
        navigate(`/checkout?ids=${idsString}`);
    };

    const selectedTotalPrice = recommendedCourses
        .filter(c => selectedCourses.includes(c.id))
        .reduce((sum, course) => sum + course.price, 0);

    const originalTotalPrice = recommendedCourses
        .filter(c => selectedCourses.includes(c.id))
        .reduce((sum, course) => sum + course.originalPrice, 0);

    const isComboSelected = selectedCourses.length === recommendedCourses.length && recommendedCourses.length > 1;
    const finalPayablePrice = isComboSelected ? selectedTotalPrice * 0.85 : selectedTotalPrice;
    const formatVND = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

    // ==========================================
    // 💥 XỬ LÝ GIAO DIỆN TRẠNG THÁI TRƯỚC KHI LOAD
    // ==========================================
    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center pt-[90px]">
                 <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                 <p className="text-slate-500 animate-pulse font-medium">Hệ thống AI đang phân tích dữ liệu và vẽ lộ trình cho bạn...</p>
            </div>
        );
    }

    if (!studyGoal) {
        return (
            <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center pt-40 px-4 text-center">
                <div className="text-5xl mb-4">🎯</div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Bạn chưa thiết lập Mục tiêu!</h2>
                <p className="text-slate-500 max-w-md mb-6">Để hệ thống có thể gợi ý lộ trình chính xác nhất, vui lòng thiết lập mục tiêu điểm số của bạn trước nhé.</p>
                <a href="/study-goal" className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2.5 px-6 rounded-lg transition-colors shadow-md">Thiết lập mục tiêu ngay</a>
            </div>
        );
    }

    if (errorMsg) {
        return <div className="pt-32 text-center text-red-500 font-bold">{errorMsg}</div>;
    }

    if (!insightData || recommendedCourses.length === 0) {
        return <div className="pt-32 text-center text-slate-500">Chưa có đủ dữ liệu để gợi ý lộ trình cho bạn.</div>;
    }

    const pointsNeeded = studyGoal.targetTotal - studyGoal.currentTotal;

    // ==========================================
    // UI CHÍNH (Giữ nguyên gốc 100% của bạn)
    // ==========================================
    return (
        <div className="min-h-screen bg-[#f8fafc] font-sans pt-[90px] pb-12 overflow-hidden">
            
            {/* 💥 INJECT CSS KEYFRAMES CHO HIỆU ỨNG ANIMATION 💥 */}
            <style>
                {`
                    @keyframes fadeSlideUp {
                        0% { opacity: 0; transform: translateY(30px); }
                        100% { opacity: 1; transform: translateY(0); }
                    }
                    .animate-stagger {
                        animation: fadeSlideUp 0.7s ease-out forwards;
                        opacity: 0; /* Ẩn trước khi animate */
                    }
                `}
            </style>

            <div className="w-full max-w-[1300px] mx-auto px-4 md:px-8">
                
                {/* --- HEADER --- */}
                <div className="mb-10 text-center animate-stagger" style={{ animationDelay: '0.1s' }}>
                    <h1 className="text-3xl md:text-4xl font-black text-emerald-600 tracking-tight drop-shadow-sm">
                        Phân Tích Năng Lực & Lộ Trình
                    </h1>
                </div>

                {/* --- GRID 4/8 --- */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                    
                    {/* CỘT TRÁI (4/12): BIỂU ĐỒ & NHẬN XÉT */}
                    <div className="lg:col-span-4 animate-stagger" style={{ animationDelay: '0.3s' }}>
                        <div className="bg-white rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 p-6 sticky top-28">
                            
                            <h3 className="text-lg font-bold text-slate-800 mb-4 text-center">Bản đồ Kỹ năng</h3>
                            
                            {/* Radar Chart */}
                            <div className="h-56 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="75%" data={insightData.skills}>
                                        <PolarGrid stroke="#f1f5f9" />
                                        <PolarAngleAxis dataKey="tagName" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }} />
                                        <Radar name="Score" dataKey="score" stroke="#10b981" fill="#34d399" fillOpacity={0.25} strokeWidth={2} />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Đoạn phân tích */}
                            <div className="mt-6 pt-5 border-t border-slate-100">
                                <p className="text-[14px] text-slate-600 leading-relaxed font-medium">
                                    <FaLightbulb className="inline text-yellow-500 mb-1 mr-1" />
                                    <span className="font-bold text-slate-800">Dựa vào sơ đồ kỹ năng của bạn, </span>
                                    để đạt mốc <span className="font-bold text-emerald-600">{studyGoal.targetTotal} {studyGoal.certType}</span>, bạn cần lấp ngay lỗ hổng: 
                                    <span className="font-bold text-orange-500"> {insightData.weakPoints?.join(", ") || ""}</span>. 
                                    Lộ trình bên cạnh được thiết kế để cộng thêm cho bạn ít nhất <span className="font-bold text-emerald-600">{pointsNeeded > 0 ? pointsNeeded : 0} điểm</span> trong thời gian tới!
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* CỘT PHẢI (8/12): LỘ TRÌNH TIMELINE */}
                    <div className="lg:col-span-8 flex flex-col">
                        
                        {/* BẢNG ĐIỀU KHIỂN CHỐT ĐƠN */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 mb-8 flex flex-col md:flex-row items-center justify-between gap-4 animate-stagger" style={{ animationDelay: '0.4s' }}>
                            
                            <div>
                                <div className="flex items-center gap-2 mb-1.5">
                                    <FaRoute className="text-emerald-500 text-lg" />
                                    <h2 className="text-xl font-extrabold text-slate-800">Lộ trình bứt phá</h2>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-semibold text-slate-600">Đã chọn: <span className="text-emerald-600 font-bold">{selectedCourses.length}/{recommendedCourses.length}</span></span>
                                    {isComboSelected ? (
                                        <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 animate-pulse">
                                            🔥 Combo: Giảm 15%
                                        </span>
                                    ) : (
                                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                                            <FaShieldAlt className="text-emerald-400" /> Chọn hết giảm 15%
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-5 w-full md:w-auto bg-slate-50 md:bg-transparent p-3 md:p-0 rounded-xl">
                                <div className="text-right flex-1 md:flex-none">
                                    <p className="text-xs text-slate-400 line-through font-semibold mb-0.5">{formatVND(originalTotalPrice)}</p>
                                    <p className="text-2xl font-black text-emerald-600 leading-none tracking-tight">{formatVND(finalPayablePrice)}</p>
                                </div>
                                <button 
                                    disabled={selectedCourses.length === 0}
                                    // 💥 THÊM MỚI: Bắn sự kiện onClick vào đây
                                    onClick={handleBuyNow} 
                                    className={`py-3 px-6 rounded-xl font-bold text-white text-sm transition-all active:scale-95 group flex-shrink-0
                                        ${selectedCourses.length === 0 
                                            ? 'bg-slate-300 cursor-not-allowed' 
                                            : 'bg-emerald-500 hover:bg-emerald-600 shadow-md shadow-emerald-500/30'
                                        }
                                    `}
                                >
                                    Mua ngay <FaArrowRight className="inline ml-1 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                        
                        {/* --- TRỤC TIMELINE (Không scroll, bung thả ga theo ý bạn) --- */}
                        <div className="relative border-l-2 border-emerald-100 ml-5 space-y-8 pb-8">
                            
                            {recommendedCourses.map((course, index) => {
                                const isSelected = selectedCourses.includes(course.id);
                                const animDelay = `${0.6 + (index * 0.2)}s`; 

                                return (
                                    <div 
                                        key={course.id} 
                                        className="relative pl-8 md:pl-10 animate-stagger" 
                                        style={{ animationDelay: animDelay }}
                                    >
                                        
                                        <div 
                                            onClick={() => handleToggleCourse(course.id)}
                                            className={`absolute -left-[17px] top-6 w-8 h-8 rounded-full border-[3px] border-white flex items-center justify-center cursor-pointer transition-all duration-300 shadow-sm
                                                ${isSelected ? 'bg-emerald-500 scale-110' : 'bg-slate-200 hover:bg-slate-300'}
                                            `}
                                        >
                                            <FaCheck className={`text-white text-xs ${isSelected ? 'block animate-[pop_0.2s_ease-out]' : 'hidden'}`} />
                                        </div>

                                        <div className={`relative bg-white rounded-2xl p-4 transition-all duration-300 group cursor-pointer
                                            ${isSelected ? 'border-2 border-emerald-500 shadow-[0_8px_30px_rgba(16,185,129,0.1)]' : 'border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-300'}
                                        `}>
                                            <a href={`/courses/${course.id}`} className="flex flex-col sm:flex-row gap-5 items-center">
                                                
                                                <div className="w-full sm:w-48 h-32 flex-shrink-0 rounded-xl overflow-hidden relative">
                                                    <img src={course.imageUrl} alt={course.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                                    
                                                    <div className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-rose-600 text-white text-[11px] font-black px-2.5 py-1 rounded-lg shadow-lg shadow-red-500/30 flex items-center gap-1">
                                                        <FaFireAlt /> -{course.discountPercent}%
                                                    </div>
                                                </div>

                                                <div className="flex-1 w-full">
                                                    <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-600 text-[11px] font-extrabold rounded-full uppercase tracking-wider mb-2 border border-emerald-100">
                                                        Giai đoạn {index + 1}
                                                    </span>
                                                    
                                                    <h3 className="text-lg font-bold text-slate-800 mb-2 leading-tight group-hover:text-emerald-600 transition-colors line-clamp-2">
                                                        {course.name}
                                                    </h3>
                                                    
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <img src={course.teacherAvatarUrl} alt="GV" className="w-6 h-6 rounded-full border border-slate-100" />
                                                        <span className="text-xs font-semibold text-slate-600">{course.teacherName}</span>
                                                        <span className="text-xs text-slate-300 px-1">•</span>
                                                        <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">{course.level}</span>
                                                    </div>

                                                    <div className="flex items-end gap-3 mt-auto">
                                                        <p className="text-2xl font-black text-slate-800 leading-none">{formatVND(course.price)}</p>
                                                    </div>
                                                </div>
                                                
                                                <div className="hidden sm:flex h-full items-center justify-center px-2 text-slate-200 group-hover:text-emerald-400 transition-colors">
                                                    <FaArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                                </div>
                                            </a>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
};

export default SuggestedComboPage;