import React, { useMemo } from "react";

const CalendarGrid = ({ selectedMonth, activityData }) => {
  const dayLabels = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

  // 1. LOGIC: Tính toán Lịch
  const calendarGrid = useMemo(() => {
    if (!selectedMonth) return [];
    
    const { year, monthIndex } = selectedMonth;
    // Tìm ngày đầu tháng là thứ mấy
    let firstDayOfWeek = new Date(year, monthIndex, 1).getDay();
    // Chuyển đổi: CN(0) -> 6, T2(1) -> 0, ...
    let startOffset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

    const weeks = [];
    let currentWeek = Array(7).fill(null);

    for (let day = 1; day <= daysInMonth; day++) {
      const dayOfWeekIndex = (startOffset + day - 1) % 7;
      currentWeek[dayOfWeekIndex] = day;

      if (dayOfWeekIndex === 6 || day === daysInMonth) {
        weeks.push(currentWeek);
        currentWeek = Array(7).fill(null);
      }
    }
    return weeks;
  }, [selectedMonth]);

  // 2. LOGIC: Màu sắc ô Heatmap
  const getColorClass = (hours) => {
    if (!hours || hours === 0) return "bg-slate-100 hover:bg-slate-200";
    if (hours < 1) return "bg-emerald-300";
    return "bg-emerald-600";
  };

  // 3. LOGIC: Nội dung Tooltip
  const getTooltipText = (hours, day) => {
    if (!day) return "";
    if (!hours || hours === 0) return `Ngày ${day}: Chưa học`;
    return `Ngày ${day}: ${hours} giờ học`;
  };

  // 4. LOGIC: Kiểm tra Ngày hôm nay
  const today = new Date();
  const checkIsToday = (day) => {
    return (
      day === today.getDate() &&
      selectedMonth.monthIndex === today.getMonth() &&
      selectedMonth.year === today.getFullYear()
    );
  };

  return (
    // QUAN TRỌNG: Không dùng overflow-hidden ở đây để Tooltip có thể tràn ra ngoài
    <div className="bg-white rounded-[2rem] p-6 shadow-xl shadow-slate-200/60 border border-slate-100 relative">
      
      {/* Background Decor (Cần overflow-hidden riêng cho nó để không bị tràn hình tròn mờ ra ngoài) */}
      <div className="absolute inset-0 rounded-[2rem] overflow-hidden pointer-events-none">
         <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100 rounded-full blur-3xl opacity-50 -mr-10 -mt-10"></div>
      </div>

      {/* --- MAIN GRID --- */}
      <div className="relative z-10 grid grid-cols-[50px_repeat(7,1fr)] gap-y-3 gap-x-2 md:gap-x-4 w-full max-w-md mx-auto">
        
        {/* A. Header Thứ (T2 - CN) */}
        <div className=""></div> {/* Ô trống góc trái */}
        {dayLabels.map((label, index) => (
          <div key={index} className="text-center text-[10px] md:text-xs font-bold text-slate-400 uppercase">
            {label}
          </div>
        ))}

        {/* B. Render Các Tuần */}
        {calendarGrid.map((weekDays, weekIndex) => (
          <React.Fragment key={weekIndex}>
            
            {/* Label Tuần (Cột đầu tiên) */}
            <div className="flex items-center text-[10px] md:text-xs font-semibold text-slate-400">
              Tuần {weekIndex + 1}
            </div>
            
            {/* 7 Ngày trong tuần */}
            {weekDays.map((day, dayIndex) => {
              const dataKey = `${selectedMonth.year}-${selectedMonth.monthIndex}-${day}`;
              const hours = activityData[dataKey];
              const isToday = day ? checkIsToday(day) : false;

              return (
                <div key={dayIndex} className="aspect-square flex items-center justify-center">
                  {day ? (
                    <div className={`
                        w-full h-full rounded-md md:rounded-lg transition-all cursor-pointer transform hover:scale-105 relative group/cell
                        ${getColorClass(hours)}
                        
                        /* QUAN TRỌNG: hover:z-[60] giúp ô đang hover nổi lên trên cùng (đè lên các ô khác) */
                        hover:z-[60]

                        /* Style cho Hôm nay: Viền cam + Bóng đổ */
                        ${isToday ? 'ring-2 ring-orange-500 ring-offset-2 z-20 shadow-md' : 'hover:shadow-sm'}
                    `}>
                      
                      {/* --- CUSTOM TOOLTIP --- */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[150px] pointer-events-none opacity-0 group-hover/cell:opacity-100 transition-opacity duration-200 px-2 py-1 bg-slate-800 text-white text-[10px] font-bold rounded shadow-lg">
                        {isToday && <span className="text-orange-300 mr-1">(Hôm nay)</span>}
                        {getTooltipText(hours, day)}
                        {/* Mũi tên nhỏ trỏ xuống */}
                        <div className="absolute top-100 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                      </div>

                      {/* Số ngày (Góc trên trái) */}
                      <span className={`absolute top-0.5 left-0.5 md:top-1 md:left-1 text-[8px] md:text-[10px] font-medium pointer-events-none 
                        ${isToday ? 'text-orange-600 font-extrabold' : (hours >= 1 ? 'text-white/80' : 'text-slate-400/80')}
                      `}>
                        {day}
                      </span>
                    </div>
                  ) : (
                    // Ô trống (Padding đầu/cuối tháng)
                    <div className="w-full h-full"></div>
                  )}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>

      {/* --- LEGEND (CHÚ THÍCH) --- */}
      <div className="flex items-center flex-wrap gap-4 mt-6 pt-4 border-t border-slate-50 justify-end">
        {/* Chú thích Hôm nay */}
        <div className="flex items-center gap-1.5 mr-auto md:mr-0">
           <div className="w-3 h-3 rounded ring-2 ring-orange-500 ring-offset-1"></div>
           <span className="text-[10px] text-slate-500">Hôm nay</span>
        </div>

        {/* Các mức độ học */}
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 bg-slate-100 rounded border border-slate-200"></div>
          <span className="text-[10px] text-slate-500">Không học</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 bg-emerald-300 rounded"></div>
          <span className="text-[10px] text-slate-500">&lt; 1 giờ</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 bg-emerald-600 rounded"></div>
          <span className="text-[10px] text-slate-500">&gt; 1 giờ</span>
        </div>
      </div>
    </div>
  );
};

export default CalendarGrid;