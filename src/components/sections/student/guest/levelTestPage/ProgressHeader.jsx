import React from "react";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";

const ProgressHeader = ({ currentQuestion, totalQuestions, timeLeft, onExit }) => {
  const progressPercentage = (currentQuestion / totalQuestions) * 100;

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4 sm:gap-8">
          
          {/* Logo Section */}
          <div className="flex items-center flex-shrink-0">
            <span className="text-2xl font-black tracking-wider bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent hover:scale-105 transition-transform cursor-pointer">
              ECHILL
            </span>
          </div>

          {/* Progress Bar Section */}
          <div className="flex-1 max-w-xl hidden sm:block">
            <div className="flex items-center justify-between text-xs font-semibold text-gray-500 mb-1.5 px-1">
              <span>Tiến trình đánh giá</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
              <motion.div
                className="bg-gradient-to-r from-emerald-400 to-teal-500 h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Question / Time Details Section */}
          <div className="flex items-center gap-4 sm:gap-6 flex-shrink-0">
            <div className="text-right">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Tiến độ</div>
              <div className="text-sm sm:text-base font-bold text-gray-800">
                Câu {currentQuestion} <span className="text-gray-400 font-normal">/ {totalQuestions}</span>
              </div>
            </div>

            <div className="h-8 w-px bg-gray-200 hidden xs:block"></div>

            <div className="flex items-center gap-2 bg-emerald-50/80 px-3 py-1.5 rounded-xl border border-emerald-100/50">
              <Clock className="w-4 h-4 text-emerald-600 animate-pulse" />
              <span className="text-xs sm:text-sm font-bold text-emerald-800 tabular-nums">
                ~{timeLeft} phút còn lại
              </span>
            </div>

            <button
              onClick={onExit}
              className="text-xs sm:text-sm font-semibold text-gray-500 hover:text-gray-800 hover:bg-gray-50 px-3 py-1.5 rounded-lg transition-colors border border-transparent hover:border-gray-200"
            >
              Để sau
            </button>
          </div>

        </div>
      </div>
      
      {/* Mobile Progress Bar (shows on very small screens) */}
      <div className="w-full bg-gray-100 h-1 sm:hidden">
        <motion.div
          className="bg-gradient-to-r from-emerald-400 to-teal-500 h-full"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </header>
  );
};

export default ProgressHeader;
