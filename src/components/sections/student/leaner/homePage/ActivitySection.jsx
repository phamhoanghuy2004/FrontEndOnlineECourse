import React, { useState, useMemo, useEffect } from "react";
import Title from "../../../../common/Title";
import { fadeInUp } from "../../../../../constants/motionVariants";
import { FaCalendarAlt } from "react-icons/fa";
import SelectField from "../../../../common/SelectField"; 
import CalendarGrid from "../../../../common/student/leaner/dashboard/CalendarGrid";
import WeeklyGoal from "../../../../common/student/leaner/dashboard/WeeklyGoal"; // <--- Import component mới

const ActivitySection = () => {
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

    // ... (Phần 2. Logic Data)
    const [activityData, setActivityData] = useState({});

    useEffect(() => {
        const mockData = {};
        const { year, monthIndex } = selectedMonthObj;
        const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

        for (let d = 1; d <= daysInMonth; d++) {
            const key = `${year}-${monthIndex}-${d}`;
            const rand = Math.random();
            let hours = 0;
            if (rand > 0.4) hours = rand > 0.7 ? 2.5 : 0.5;
            mockData[key] = hours;
        }
        setActivityData(mockData);
    }, [selectedMonthObj]);


    // --- 3. LOGIC MỚI: TÍNH TỔNG GIỜ HỌC TRONG TUẦN HIỆN TẠI ---
    const [weeklyHours, setWeeklyHours] = useState(0);
    const [isClaimed, setIsClaimed] = useState(false); // State lưu trạng thái đã nhận thưởng chưa

    useEffect(() => {
        // Chỉ tính toán nếu đang xem tháng hiện tại
        if (!selectedMonthObj.isCurrent) {
            setWeeklyHours(0);
            return;
        }

        const today = new Date();
        const currentDay = today.getDay(); // 0 (CN) -> 6 (T7)
        // Tính ngày thứ 2 của tuần này (Monday)
        // Nếu hôm nay là CN (0), thì thứ 2 là today - 6 ngày. Nếu không thì là today - (currentDay - 1)
        const diff = today.getDate() - currentDay + (currentDay === 0 ? -6 : 1); 
        
        const monday = new Date(today.setDate(diff));
        
        let total = 0;
        // Loop từ Thứ 2 đến Chủ Nhật (7 ngày)
        for (let i = 0; i < 7; i++) {
            const tempDate = new Date(monday);
            tempDate.setDate(monday.getDate() + i);

            // Kiểm tra xem ngày này có nằm trong tháng hiện tại không
            if (tempDate.getMonth() === selectedMonthObj.monthIndex) {
                const key = `${tempDate.getFullYear()}-${tempDate.getMonth()}-${tempDate.getDate()}`;
                if (activityData[key]) {
                    total += activityData[key];
                }
            }
        }
        setWeeklyHours(total);
    }, [activityData, selectedMonthObj]);

    // Hàm xử lý khi bấm nhận thưởng
    const handleClaimReward = () => {
        alert("Chúc mừng! Bạn đã nhận được 10 xu vào tài khoản.");
        setIsClaimed(true);
        // Ở đây bạn có thể gọi API cập nhật xu cho user
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
                
                {/* --- WEEKLY GOAL (Chỉ hiện khi xem Tháng Hiện Tại) --- */}
                {selectedMonthObj.isCurrent && (
                     <WeeklyGoal 
                        currentHours={weeklyHours} 
                        targetHours={10} 
                        isClaimed={isClaimed}
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