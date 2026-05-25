import React, { useState, useEffect } from 'react'; // 🔴 Nhớ import hooks
import StatsOverview from '../../../components/common/student/leaner/dashboard/StatsOverview';
import ActivitySection from '../../../components/sections/student/leaner/homePage/ActivitySection';
import WelcomeSection from '../../../components/sections/student/leaner/homePage/WelcomeSection';
import ContinueLearningSection from '../../../components/sections/student/leaner/homePage/ContinueLearningSection';
import AdaptiveLearningSection from '../../../components/sections/student/leaner/homePage/AdaptiveLearningSection';
import Recommended from '../../../components/sections/student/leaner/homePage/Recommended';
import { motion } from 'framer-motion';
import { fadeInRight } from '../../../constants/motionVariants';
import studyAnalyticsApi from '../../../api/studyAnalyticsApi'; // 🔴 Import API

const LearnerHomePage = () => {
    // 🔴 Khởi tạo state lưu trữ dữ liệu thời gian học
    const [studyTimeData, setStudyTimeData] = useState(null);

    // 🔴 Gọi API 1 lần duy nhất ở Component Cha
    useEffect(() => {
        const fetchStudyTime = async () => {
            try {
                const response = await studyAnalyticsApi.getWeeklyStudySeconds();
                // ✅ THÀNH CÔNG: Bóc tách data chuẩn luật
                // Dữ liệu này bao gồm cả { currentSeconds, targetSeconds }
                setStudyTimeData(response.data);
            } catch (err) {
                // 🚨 THẤT BẠI: Bắt lỗi chuẩn luật
                console.error("Lỗi tải thời gian học:", err.message || err.code);
            }
        };

        fetchStudyTime();
    }, []);

    return (
        <>
            <WelcomeSection />
            {/* 2. Main Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column (Content chính) - Chiếm 2 phần */}
                <div className="lg:col-span-2 space-y-8">
                    <ContinueLearningSection />
                    <AdaptiveLearningSection />
                    
                    {/* 🔴 Truyền data xuống cho khối Nhận thưởng (ActivitySection) */}
                    <ActivitySection studyTimeData={studyTimeData} />
                    
                    <Recommended />
                </div>

                {/* Right Column (Sidebar phụ) - Chiếm 1 phần */}
                <div className="lg:col-span-1 space-y-8">

                    {/* Statistics */}
                    <motion.div
                        variants={fadeInRight}
                        initial="hidden"
                        animate="visible"
                        className="h-full"
                    >
                        {/* 🔴 Truyền data xuống cho Bảng thống kê */}
                        <StatsOverview studyTimeData={studyTimeData} />
                    </motion.div>

                </div>

            </div>
        </>
    );
};

export default LearnerHomePage;