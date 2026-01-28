const ActivityHeatmap = () => {
    // Tạo data giả cho 7 ngày * 12 tuần (khoảng 3 tháng)
    const weeks = 18;
    const days = 7;
    
    return (
      <div className="bg-white rounded-[2rem] p-6 shadow-xl shadow-slate-200/60 border border-slate-100 mt-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100 rounded-full blur-3xl opacity-50 -mr-10 -mt-10"></div>
        
        <div className="flex justify-between items-end mb-4 relative z-10">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-teal-500 rounded-full"></span>
                Tần suất học tập
            </h3>
            <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-3 py-1 rounded-full">3 ngày liên tiếp 🔥</span>
        </div>

        <div className="flex gap-1 overflow-x-auto pb-2 custom-scrollbar relative z-10">
            {[...Array(weeks)].map((_, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1">
                    {[...Array(days)].map((_, dayIndex) => {
                         // Random mức độ active để demo
                         const intensity = Math.random() > 0.7 ? (Math.random() > 0.5 ? 2 : 1) : 0; 
                         const colors = [
                             'bg-slate-100', // 0: Không học
                             'bg-emerald-300', // 1: Học ít
                             'bg-emerald-500'  // 2: Học nhiều
                         ];
                         return (
                             <div 
                                key={dayIndex} 
                                className={`w-3 h-3 md:w-4 md:h-4 rounded-sm ${colors[intensity]} hover:ring-2 ring-emerald-200 transition-all cursor-pointer`}
                                title={`Ngày ${dayIndex + 1}, Tuần ${weekIndex + 1}`}
                             ></div>
                         )
                    })}
                </div>
            ))}
        </div>
        <div className="flex items-center gap-2 mt-3 text-[10px] text-slate-400 justify-end">
            <span>Ít</span>
            <div className="w-3 h-3 bg-slate-100 rounded-sm"></div>
            <div className="w-3 h-3 bg-emerald-300 rounded-sm"></div>
            <div className="w-3 h-3 bg-emerald-500 rounded-sm"></div>
            <span>Nhiều</span>
        </div>
      </div>
    );
  };
  export default ActivityHeatmap;