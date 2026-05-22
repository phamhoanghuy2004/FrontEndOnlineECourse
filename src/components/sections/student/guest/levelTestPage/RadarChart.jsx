import React, { useState, useEffect } from "react";

const RadarChart = ({ scores }) => {
  const [animatedScores, setAnimatedScores] = useState({
    Grammar: 0,
    Vocabulary: 0,
    Reading: 0,
    Listening: 0
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScores(scores);
    }, 150);
    return () => clearTimeout(timer);
  }, [scores]);

  const cx = 270;
  const cy = 200;
  const maxVal = 5;
  const stepVal = 30; // Radius increment per level
  const maxRadius = maxVal * stepVal; // 150

  const axes = [
    { name: "Ngữ pháp (Grammar)", key: "Grammar", angle: -Math.PI / 2, labelX: cx, labelY: cy - maxRadius - 20, textAnchor: "middle" },
    { name: "Từ vựng (Vocabulary)", key: "Vocabulary", angle: 0, labelX: cx + maxRadius + 15, labelY: cy + 5, textAnchor: "start" },
    { name: "Đọc hiểu (Reading)", key: "Reading", angle: Math.PI / 2, labelX: cx, labelY: cy + maxRadius + 25, textAnchor: "middle" },
    { name: "Nghe hiểu (Listening)", key: "Listening", angle: Math.PI, labelX: cx - maxRadius - 15, labelY: cy + 5, textAnchor: "end" }
  ];

  const getPointsStr = (dataObj) => {
    return axes
      .map((axis) => {
        const value = dataObj[axis.key] || 0;
        const r = value * stepVal;
        const x = cx + r * Math.cos(axis.angle);
        const y = cy + r * Math.sin(axis.angle);
        return `${x},${y}`;
      })
      .join(" ");
  };

  const pointsStr = getPointsStr(animatedScores);

  return (
    <div className="w-full max-w-sm sm:max-w-md mx-auto aspect-[9/7] flex items-center justify-center p-2 bg-white rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
      <svg
        viewBox="0 0 540 420"
        className="w-full h-full select-none"
      >
        <defs>
          <linearGradient id="radarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34d399" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.2" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Concentric grid diamonds (Levels 1 - 5) */}
        {Array.from({ length: maxVal }).map((_, idx) => {
          const level = idx + 1;
          const r = level * stepVal;
          const points = axes
            .map((axis) => {
              const x = cx + r * Math.cos(axis.angle);
              const y = cy + r * Math.sin(axis.angle);
              return `${x},${y}`;
            })
            .join(" ");

          return (
            <polygon
              key={level}
              points={points}
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="1"
              strokeDasharray={level === maxVal ? "0" : "3 3"}
            />
          );
        })}

        {/* Concentric grid value markers */}
        {Array.from({ length: maxVal }).map((_, idx) => {
          const level = idx + 1;
          const r = level * stepVal;
          return (
            <g key={level} className="opacity-60">
              <rect
                x={cx - 10}
                y={cy - r - 8}
                width="20"
                height="14"
                rx="4"
                fill="#F3F4F6"
              />
              <text
                x={cx}
                y={cy - r + 2}
                textAnchor="middle"
                fontSize="9"
                fontWeight="800"
                fill="#6B7280"
              >
                L{level}
              </text>
            </g>
          );
        })}

        {/* Axis lines */}
        {axes.map((axis, index) => {
          const endX = cx + maxRadius * Math.cos(axis.angle);
          const endY = cy + maxRadius * Math.sin(axis.angle);
          return (
            <line
              key={index}
              x1={cx}
              y1={cy}
              x2={endX}
              y2={endY}
              stroke="#D1D5DB"
              strokeWidth="1.5"
            />
          );
        })}

        {/* User scores polygon */}
        <polygon
          points={pointsStr}
          fill="url(#radarGrad)"
          stroke="#10b981"
          strokeWidth="3"
          strokeLinejoin="round"
          className="transition-all duration-1000 ease-out"
        />

        {/* Data points */}
        {axes.map((axis) => {
          const val = animatedScores[axis.key] || 0;
          if (val === 0) return null;
          const r = val * stepVal;
          const ptX = cx + r * Math.cos(axis.angle);
          const ptY = cy + r * Math.sin(axis.angle);

          return (
            <g key={axis.key} filter="url(#glow)">
              <circle
                cx={ptX}
                cy={ptY}
                r="6"
                fill="#10b981"
                stroke="#FFFFFF"
                strokeWidth="2"
                className="transition-all duration-1000 ease-out hover:r-8 cursor-pointer"
              />
            </g>
          );
        })}

        {/* Axis text labels */}
        {axes.map((axis) => (
          <text
            key={axis.key}
            x={axis.labelX}
            y={axis.labelY}
            textAnchor={axis.textAnchor}
            fontSize="12"
            fontWeight="bold"
            fill="#374151"
            className="font-sans"
          >
            {axis.name}
          </text>
        ))}
      </svg>
    </div>
  );
};

export default RadarChart;
