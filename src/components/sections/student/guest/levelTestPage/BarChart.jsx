import React from "react";

const BarChart = ({ skills }) => {
  if (!skills || !Array.isArray(skills) || skills.length === 0) {
    return <div className="text-center text-gray-400 py-6">Không có dữ liệu biểu đồ.</div>;
  }

  // Get color based on score or mastery level
  const getBarColor = (score) => {
    return "from-emerald-400 to-emerald-600 shadow-emerald-100/30";
  };

  return (
    <div className="w-full py-4 px-2">
      {/* Chart container with side-by-side Y-axis and drawing area */}
      <div className="flex items-stretch h-60 w-full">
        
        {/* Left Column: Y-axis Labels */}
        <div className="flex flex-col justify-between items-end pr-2 pb-8 select-none text-[10px] font-bold text-gray-400 w-8">
          {[100, 75, 50, 25, 0].map((val) => (
            <span key={val} className="h-0 flex items-center justify-end">
              {val}
            </span>
          ))}
        </div>

        {/* Right Column: Chart Drawing Area */}
        <div className="flex-1 relative flex items-end justify-around border-b border-gray-200 pb-2">
          
          {/* Background Grid Lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8 select-none">
            {[100, 75, 50, 25, 0].map((val) => (
              <div key={val} className="w-full h-0 flex items-center">
                <div className="flex-1 border-t border-dashed border-gray-100"></div>
              </div>
            ))}
          </div>

          {/* Bars */}
          {skills.map((skill, idx) => {
            const score = skill.score || 0;
            // Calculate percentage height
            const barHeight = `${Math.max(5, Math.min(100, score))}%`;

            return (
              // 🟢 FIX 1: Đổi w-16 thành flex-1 để 4 cột chia đều 100% chiều ngang
              <div key={idx} className="relative z-10 flex-1 flex flex-col justify-end items-center h-full group">
                {/* Score tooltip/badge above the bar */}
                <span className="text-xs font-black text-gray-700 mb-2 opacity-90 group-hover:scale-110 transition-transform">
                  {score}%
                </span>
                
                {/* The actual Bar */}
                <div 
                  className="w-8 sm:w-10 rounded-t-xl bg-gradient-to-t shadow-md transition-all duration-700 ease-out origin-bottom hover:brightness-105"
                  style={{ 
                    height: barHeight,
                    animation: `growUp 1s ease-out ${idx * 0.15}s forwards`
                  }}
                >
                  <div className={`w-full h-full bg-gradient-to-t ${getBarColor(score)} rounded-t-xl`}></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* X-axis Labels */}
      <div className="w-full flex mt-4">
        {/* Spacer to match the Y-axis label column width */}
        <div className="w-8"></div>
        {/* Labels row */}
        <div className="flex-1 flex justify-around">
          {skills.map((skill, idx) => (
            // 🟢 FIX 2: Đồng bộ flex-1 giống cột Bar ở trên, thêm min-w-0 để chống phình to text
            <div key={idx} className="flex-1 flex justify-center px-1 min-w-0">
              <p className="text-[11px] sm:text-xs font-black text-gray-600 truncate leading-tight w-full text-center">
                {skill.tagName || skill.name}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Inline styles for the grow animation */}
      <style>{`
        @keyframes growUp {
          from {
            transform: scaleY(0);
          }
          to {
            transform: scaleY(1);
          }
        }
      `}</style>
    </div>
  );
};

export default BarChart;