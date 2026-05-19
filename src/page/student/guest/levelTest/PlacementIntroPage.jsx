import React from "react";
import { motion } from "framer-motion";
import { Clock, BookOpen, Layers, CheckCircle2, ChevronRight } from "lucide-react";

const PlacementIntroPage = ({ onStart, onCancel }) => {
  const highlights = [
    "Không cần chuẩn bị trước kiến thức",
    "Đề thi cá nhân hóa dựa trên năng lực thời gian thực",
    "Kết quả phân tích chi tiết điểm mạnh và phần cần cải thiện",
    "Đề xuất lộ trình học và khóa học tối ưu nhất cho bạn"
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-50/50 via-white to-emerald-50/30 py-16 px-4 sm:px-6 flex items-center justify-center pt-24 select-none">
      
      {/* Decorative backdrop blobs */}
      <div className="absolute top-1/4 left-10 w-72 h-72 bg-indigo-200/20 rounded-full blur-3xl pointer-events-none animate-float-slow"></div>
      <div className="absolute bottom-1/4 right-10 w-72 h-72 bg-emerald-200/20 rounded-full blur-3xl pointer-events-none animate-float-delayed"></div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-4xl bg-white/80 backdrop-blur-md rounded-3xl border border-gray-100 shadow-xl p-6 sm:p-10 md:p-12 relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center"
      >
        
        {/* Left Side: Illustration */}
        <div className="md:col-span-5 flex flex-col items-center justify-center space-y-6">
          <div className="relative w-full aspect-square max-w-[280px] bg-gradient-to-tr from-emerald-100/50 to-indigo-100/50 rounded-2xl flex items-center justify-center shadow-inner group">
            <div className="absolute inset-0 rounded-2xl border border-white group-hover:scale-105 transition-transform duration-500"></div>
            
            <svg
              className="w-4/5 h-4/5 text-emerald-600/80 drop-shadow-md"
              viewBox="0 0 200 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="35" y="45" width="130" height="110" rx="16" fill="white" stroke="#34D399" strokeWidth="6" />
              <line x1="60" y1="80" x2="140" y2="80" stroke="#312E81" strokeWidth="5" strokeLinecap="round" />
              <line x1="60" y1="105" x2="120" y2="105" stroke="#312E81" strokeWidth="5" strokeLinecap="round" />
              <line x1="60" y1="130" x2="90" y2="130" stroke="#34D399" strokeWidth="5" strokeLinecap="round" />
              <circle cx="150" cy="125" r="18" fill="#818CF8" />
              <path d="M144 125L148 129L156 121" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>

            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 -right-4 bg-indigo-600 text-white text-[10px] font-black tracking-widest uppercase px-3 py-1.5 rounded-xl shadow-lg"
            >
              Adaptive AI
            </motion.div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3 w-full">
            <div className="bg-gray-50/80 border border-gray-100 rounded-xl p-2.5 text-center flex flex-col items-center justify-center">
              <Clock className="w-4 h-4 text-emerald-600 mb-1" />
              <span className="text-[10px] font-bold text-gray-400 uppercase">Thời gian</span>
              <span className="text-xs font-black text-gray-800">7-10 phút</span>
            </div>
            <div className="bg-gray-50/80 border border-gray-100 rounded-xl p-2.5 text-center flex flex-col items-center justify-center">
              <BookOpen className="w-4 h-4 text-emerald-600 mb-1" />
              <span className="text-[10px] font-bold text-gray-400 uppercase">Câu hỏi</span>
              <span className="text-xs font-black text-gray-800">15-20 câu</span>
            </div>
            <div className="bg-gray-50/80 border border-gray-100 rounded-xl p-2.5 text-center flex flex-col items-center justify-center">
              <Layers className="w-4 h-4 text-emerald-600 mb-1" />
              <span className="text-[10px] font-bold text-gray-400 uppercase">Kỹ năng</span>
              <span className="text-xs font-black text-gray-800">4 nhóm</span>
            </div>
          </div>
        </div>

        {/* Right Side: Text & Actions */}
        <div className="md:col-span-7 flex flex-col justify-center space-y-6 text-left">
          
          <div className="space-y-3">
            <span className="inline-block bg-emerald-50 text-emerald-700 text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full border border-emerald-100">
              Kiểm tra xếp lớp
            </span>
            
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight">
              Đánh giá năng lực <br />
              <span className="bg-gradient-to-r from-emerald-500 to-indigo-600 bg-clip-text text-transparent">
                TOEIC của bạn
              </span>
            </h1>

            <p className="text-sm sm:text-base text-gray-500 font-semibold leading-relaxed">
              Chỉ mất khoảng 7–10 phút để xây dựng lộ trình học phù hợp nhất với bạn. Đề thi sẽ tự động điều chỉnh độ khó tương ứng với câu trả lời của bạn.
            </p>
          </div>

          <div className="space-y-2.5">
            {highlights.map((text, idx) => (
              <div key={idx} className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-gray-700 font-semibold leading-relaxed">
                  {text}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            <button
              onClick={onStart}
              className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-3.5 px-6 rounded-2xl transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-200/50 flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              Bắt đầu đánh giá
              <ChevronRight className="w-4 h-4" />
            </button>
            
            <button
              onClick={onCancel}
              className="px-6 py-3.5 rounded-2xl text-gray-500 hover:text-gray-800 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 font-bold transition-all text-sm flex items-center justify-center cursor-pointer"
            >
              Để sau
            </button>
          </div>

        </div>

      </motion.div>
    </div>
  );
};

export default PlacementIntroPage;
