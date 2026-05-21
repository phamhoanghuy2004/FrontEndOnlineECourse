import React from "react";

const ProgressHeader = ({ currentQuestion, onExit }) => {
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

          {/* Question Details Section */}
          <div className="flex items-center gap-4 sm:gap-6 flex-shrink-0 ml-auto">
            <div className="text-right">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Tiến độ</div>
              <div className="text-sm sm:text-base font-bold text-gray-800">
                Câu {currentQuestion}
              </div>
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
    </header>
  );
};

export default ProgressHeader;
