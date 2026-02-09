import React from 'react';

const ProgressBar = ({ 
    value = 0, 
    max = 100, 
    height = "h-3", 
    trackColor = "bg-gray-200", 
    fillColor = "bg-emerald-500", 
    shadowColor = "", 
    className = "" 
}) => {
    // 1. Tính toán % và đảm bảo nó nằm trong khoảng 0-100
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    return (
        <div className={`w-full rounded-full overflow-hidden ${height} ${trackColor} ${className}`}>
            <div 
                className={`h-full rounded-full transition-all duration-1000 ease-out ${fillColor} ${shadowColor}`}
                style={{ width: `${percentage}%` }}
                role="progressbar"
                aria-valuenow={value}
                aria-valuemin="0"
                aria-valuemax={max}
            ></div>
        </div>
    );
};

export default ProgressBar;