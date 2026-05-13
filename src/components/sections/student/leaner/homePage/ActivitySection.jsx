import React, { useState, useMemo, useEffect } from "react";
import Title from "../../../../common/Title";
import { fadeInUp } from "../../../../../constants/motionVariants";
import { FaCalendarAlt } from "react-icons/fa";
import SelectField from "../../../../common/SelectField";
import CalendarGrid from "../../../../common/student/leaner/dashboard/CalendarGrid";
import WeeklyGoal from "../../../../common/student/leaner/dashboard/WeeklyGoal";
import studyAnalyticsApi from "../../../../../api/studyAnalyticsApi";
import toast from "react-hot-toast";

// 🔴 1. Import useAuth để dùng fetchUserProfile
import { useAuth } from '../../../../../hooks/useAuth';

const ActivitySection = ({ studyTimeData }) => {
    // 🔴 2. Lấy hàm fetchUserProfile từ Context
    const { fetchUserProfile } = useAuth();

    // ... (Giữ nguyên phần 1. Logic tạo danh sách 3 tháng)
    const getLast3Months = () => {
        const today = new Date();
        const months = [];
        for (let i = 0; i < 3; i++) {
            const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
            months.push({
                id: `${d.getFullYear()}-${d.getMonth()}`,
                label: `Tháng ${d.getMonth() + 1}/${d.getFullYear()}`,
                monthIndex: d.getMonth(),
                year: d.getFullYear(),
                isCurrent: i === 0
            });
        }
        return months;
    };

    const monthsList = useMemo(() => getLast3Months(), []);
    const [selectedMonthId, setSelectedMonthId] = useState(monthsList[0].id);

    const selectedMonthObj = useMemo(() =>
        monthsList.find(m => m.id === selectedMonthId) || monthsList[0],
        [selectedMonthId, monthsList]
    );

    const selectOptions = monthsList.map(m => ({
        value: m.id,
        label: m.isCurrent ? `${m.label} (Hiện tại)` : m.label
    }));

    // ... (Phần 2. Logic gọi API dữ liệu tháng giữ nguyên như tôi đã hướng dẫn ở các bài trước)
    const [activityData, setActivityData] = useState({});

    // 🔴 GỌI API KHI CHUYỂN THÁNG
    // 🔴 GỌI API KHI CHUYỂN THÁNG
    useEffect(() => {
        const fetchMonthlyData = async () => {
            try {
                const { year, monthIndex } = selectedMonthObj;
                // JS month là 0-11, Backend cần 1-12 nên phải + 1
                const apiMonth = monthIndex + 1;

                const response = await studyAnalyticsApi.getMonthlyActivity(year, apiMonth);

                // Dữ liệu BE trả về: { "1": 3600, "5": 7200 } (Đơn vị: Giây)
                const rawData = response.data?.dailyData || {};

                const formattedData = {};

                // 🔴 BÍ QUYẾT TẠO KEY: Quét qua các ngày có dữ liệu từ BE, ráp lại thành Key cũ
                Object.keys(rawData).forEach(day => {
                    const totalSeconds = rawData[day];

                    // 💥 Áp dụng ý tưởng của bạn: Dùng Math.ceil (Làm tròn LÊN)
                    // Công thức: (19s / 3600) * 10 = 0.0527 -> Math.ceil(0.0527) = 1 -> 1 / 10 = 0.1 giờ
                    const hours = Math.ceil((totalSeconds / 3600) * 10) / 10;

                    // Khôi phục Key gốc của bạn: year-monthIndex-day
                    const fullKey = `${year}-${monthIndex}-${day}`;

                    // Gán vào data để vẽ Lịch
                    formattedData[fullKey] = hours;
                });

                // Cập nhật State cho Grid Lịch vẽ
                setActivityData(formattedData);
            } catch (err) {
                console.error("Lỗi lấy lịch sử học tháng:", err);
                // toast.error("Không thể tải dữ liệu lịch học.");
            }
        };

        fetchMonthlyData();
    }, [selectedMonthObj]);

    // --- 3. 🔴 FIX LOGIC HIỂN THỊ GIỜ & NHẬN THƯỞNG ---

    // Dùng Math.floor để cắt bỏ phần thừa (Ví dụ: 9.95 -> Math.floor(99.5)/10 -> 9.9)
    // Giúp UI hiển thị đúng số giờ học, không bị làm tròn "ăn gian"
    const currentHours = studyTimeData?.currentSeconds
        ? Math.floor((studyTimeData.currentSeconds / 3600) * 10) / 10
        : 0;

    const targetHours = studyTimeData?.targetSeconds
        ? Math.floor((studyTimeData.targetSeconds / 3600) * 10) / 10
        : 10;

    // 🔴 Biến quyết định nút sáng hay tắt (So sánh số GIÂY tuyệt đối, không so sánh số GIỜ)
    const isGoalMet = (studyTimeData?.currentSeconds || 0) >= (studyTimeData?.targetSeconds || 36000);

    const isClaimedInit = studyTimeData?.isClaimed || false;
    const [isClaimed, setIsClaimed] = useState(isClaimedInit);

    useEffect(() => {
        if (studyTimeData !== null && studyTimeData !== undefined) {
            setIsClaimed(studyTimeData.isClaimed);
        }
    }, [studyTimeData]);

    const handleClaimReward = async () => {
        try {
            await studyAnalyticsApi.claimWeeklyReward();
            toast.success("Chúc mừng! Bạn đã nhận được 10 xu.");
            setIsClaimed(true);
            fetchUserProfile(); // 🔴 Hàm này giờ đã chạy bình thường
        } catch (err) {
            toast.error(err.message || "Có lỗi xảy ra");
        }
    };

    return (
        <section>
            <div className="mt-8">
                {/* --- HEADER --- */}
                <div className="flex justify-between items-end mb-4 px-1">
                    <Title
                        text="Tần suất học tập của bạn"
                        className="!text-xl font-bold !text-slate-800 !mb-0"
                        variants={fadeInUp}
                    />

                    <div className="min-w-[200px]">
                        <SelectField
                            icon={FaCalendarAlt}
                            name="monthSelect"
                            value={selectedMonthId}
                            onChange={(e) => setSelectedMonthId(e.target.value)}
                            options={selectOptions}
                            size="compact"
                        />
                    </div>
                </div>

                {/* --- WEEKLY GOAL --- */}
                {selectedMonthObj.isCurrent && (
                    <WeeklyGoal
                        currentHours={currentHours}
                        targetHours={targetHours}
                        isClaimed={isClaimed}
                        // 🔴 Truyền cờ này xuống cho WeeklyGoal để render nút Đã nhận / Nhận ngay
                        isGoalMet={isGoalMet}
                        onClaim={handleClaimReward}
                    />
                )}

                {/* --- CALENDAR COMPONENT --- */}
                <CalendarGrid
                    selectedMonth={selectedMonthObj}
                    activityData={activityData}
                />
            </div>
        </section>
    );
};

export default ActivitySection;