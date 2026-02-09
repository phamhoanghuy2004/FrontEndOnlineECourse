const RevenueChart = () => {
    // Mock Data for 12 months
    const data = [
        { month: 'T1', value: 45 },
        { month: 'T2', value: 52 },
        { month: 'T3', value: 38 },
        { month: 'T4', value: 65 },
        { month: 'T5', value: 48 },
        { month: 'T6', value: 55 },
        { month: 'T7', value: 72 },
        { month: 'T8', value: 68 },
        { month: 'T9', value: 85 },
        { month: 'T10', value: 76 },
        { month: 'T11', value: 92 },
        { month: 'T12', value: 35 }, // Current incomplete
    ];

    const maxVal = Math.max(...data.map(d => d.value));

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-lg font-bold text-slate-800">Biểu đồ doanh thu</h3>
                    <p className="text-sm text-slate-500">Thống kê theo từng tháng (Đơn vị: Triệu VNĐ)</p>
                </div>
                <select className="bg-slate-50 border border-slate-200 rounded-lg text-sm p-2 outline-none font-medium text-slate-700">
                    <option>Năm nay (2025)</option>
                    <option>Năm ngoái (2024)</option>
                </select>
            </div>

            <div className="h-64 flex items-end justify-between gap-2 md:gap-4">
                {data.map((item, index) => {
                    const heightPercent = (item.value / maxVal) * 100;
                    return (
                        <div key={index} className="flex flex-col items-center gap-2 flex-1 group">
                            <div className="relative w-full bg-slate-100 rounded-t-lg overflow-hidden flex items-end h-full">
                                <div
                                    style={{ height: `${heightPercent}%` }}
                                    className="w-full bg-emerald-500 rounded-t-lg hover:bg-emerald-600 transition-all duration-300 relative group-hover:shadow-[0_0_20px_rgba(16,185,129,0.5)]"
                                >
                                    {/* Tooltip */}
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-10 font-bold">
                                        {item.value}tr
                                    </div>
                                </div>
                            </div>
                            <span className="text-xs font-bold text-slate-500">{item.month}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default RevenueChart;

