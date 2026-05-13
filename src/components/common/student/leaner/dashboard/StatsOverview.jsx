import React, { useState, useEffect } from 'react';
import { FaBookReader, FaClipboardCheck, FaHistory, FaCoins } from 'react-icons/fa';
import { useAuth } from '../../../../../hooks/useAuth';
import studyAnalyticsApi from '../../../../../api/studyAnalyticsApi';

const StatItem = ({ icon: Icon, label, value, color }) => (
    <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg ${color}`}>
            <Icon size={20} />
        </div>
        <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">{label}</p>
            <p className="text-xl font-bold text-slate-800">{value}</p>
        </div>
    </div>
);

// 🔴 Nhận prop 'studyTimeData' từ Component Cha truyền xuống
const StatsOverview = ({ studyTimeData }) => {
    const { user, fetchUserProfile } = useAuth();
    
    // 🔴 State bây giờ chỉ còn quản lý lessons và tests
    const [stats, setStats] = useState({
        lessons: 0,
        tests: 0
    });

    useEffect(() => {
        const fetchDashboardStats = async () => {
            try {
                // 🔴 Chỉ gọi 2 API (bỏ API getWeeklyStudySeconds đi)
                const [lessonsRes, testsRes] = await Promise.all([
                    studyAnalyticsApi.getWeeklyCompletedLessons(),
                    studyAnalyticsApi.getWeeklyCompletedTests()
                ]);

                // ✅ Lấy dữ liệu chuẩn luật response.data
                setStats({
                    lessons: lessonsRes.data || 0,
                    tests: testsRes.data || 0
                });
            } catch (err) {
                // 🚨 Bắt lỗi chuẩn luật err
                console.error("Lỗi khi tải thống kê bài học:", err.message || err.code);
            }
        };

        fetchDashboardStats();
        
        if (user) {
            fetchUserProfile();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const formatStudyTime = (totalSeconds) => {
        if (!totalSeconds || totalSeconds === 0) return "0m";
        
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;

        if (h > 0) return `${h}h ${m}m`; 
        if (m > 0) return `${m}m ${s}s`; 
        return `${s}s`;                  
    };

    const formattedCoins = user?.currentCoin 
        ? new Intl.NumberFormat('en-US').format(user.currentCoin) 
        : "0";

    return (
        <div className="bg-white rounded-[2rem] p-6 shadow-xl shadow-slate-200/60 border border-slate-100 h-full">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
                Bảng thống kê (Tuần này)
            </h3>
            <div className="grid grid-cols-1 gap-2">
                <StatItem 
                    icon={FaBookReader} 
                    label="Tổng số bài đã hoàn thành" 
                    value={stats.lessons < 10 && stats.lessons > 0 ? `0${stats.lessons}` : stats.lessons} 
                    color="bg-blue-500 shadow-blue-500/30" 
                />
                <StatItem 
                    icon={FaClipboardCheck} 
                    label="Tổng số bài test đã hoàn thành" 
                    value={stats.tests < 10 && stats.tests > 0 ? `0${stats.tests}` : stats.tests} 
                    color="bg-purple-500 shadow-purple-500/30" 
                />
                <StatItem 
                    icon={FaHistory} 
                    label="Tổng thời lượng học" 
                    // 🔴 Lấy currentSeconds từ prop của Cha truyền xuống một cách an toàn
                    value={formatStudyTime(studyTimeData?.currentSeconds || 0)} 
                    color="bg-orange-500 shadow-orange-500/30" 
                />
                
                <div className="mt-2 pt-4 border-t border-slate-100">
                    <StatItem 
                        icon={FaCoins} 
                        label="Số Coin hiện có" 
                        value={formattedCoins} 
                        color="bg-yellow-400 shadow-yellow-400/30" 
                    />
                </div>
            </div>
        </div>
    );
};

export default StatsOverview;