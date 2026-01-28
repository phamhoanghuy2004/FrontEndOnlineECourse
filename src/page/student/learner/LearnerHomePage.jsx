// src/pages/student/learner/LearnerHomePage.jsx
import ContinueLearning from '../../../components/common/student/leaner/dashboard/ContinueLearning';
import StatsOverview from '../../../components/common/student/leaner/dashboard/StatsOverview';
import ActivityHeatmap from '../../../components/common/student/leaner/dashboard/ActivityHeatmap';
import { motion } from 'framer-motion';

const LearnerHomePage = () => {
  return (
    <>
      {/* 1. Welcome Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h2 className="text-3xl font-extrabold text-slate-800 mb-1">
            Xin chào, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">Huy Nguyen</span> 👋
        </h2>
        <p className="text-slate-500">Hôm nay là một ngày tuyệt vời để chinh phục tiếng Anh!</p>
      </motion.div>

      {/* 2. Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column (Content chính) - Chiếm 2 phần */}
          <div className="lg:col-span-2 space-y-8">
              
              {/* Continue Learning Section */}
              <section>
                  <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold text-slate-800">Tiếp tục học</h3>
                      <a href="#" className="text-emerald-600 text-sm font-bold hover:underline">Xem tất cả</a>
                  </div>
                  <ContinueLearning />
              </section>

              {/* Activity Map */}
              <section>
                  <ActivityHeatmap />
              </section>

              {/* (Optional) Recommended Courses */}
              <section>
                 <h3 className="text-xl font-bold text-slate-800 mb-4">Gợi ý cho bạn</h3>
                 <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[2rem] p-6 text-white relative overflow-hidden shadow-lg">
                    <div className="relative z-10">
                        <h4 className="text-2xl font-bold mb-2">Luyện đề IELTS Full Test</h4>
                        <p className="opacity-90 mb-4 text-sm max-w-md">Bộ đề mới nhất 2026, có giải thích chi tiết và chấm điểm AI.</p>
                        <button className="bg-white text-indigo-600 font-bold py-2 px-6 rounded-full shadow-lg hover:scale-105 transition-transform">Thử ngay</button>
                    </div>
                    {/* Decor circle */}
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
                 </div>
              </section>

          </div>

          {/* Right Column (Sidebar phụ) - Chiếm 1 phần */}
          <div className="lg:col-span-1 space-y-8">
              
              {/* Statistics */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="h-full"
              >
                  <StatsOverview />
              </motion.div>

              {/* Daily Goal / Motivation (Thêm vào cho đẹp) */}
              <div className="bg-[#f0fdf4] border border-emerald-100 rounded-[2rem] p-6 text-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm text-2xl">🎯</div>
                  <h4 className="font-bold text-slate-800 mb-1">Mục tiêu ngày</h4>
                  <p className="text-xs text-slate-500 mb-3">Hoàn thành 1 bài học để giữ chuỗi!</p>
                  <div className="w-full bg-white rounded-full h-3 mb-1 border border-emerald-100">
                      <div className="bg-emerald-500 h-full rounded-full w-[60%]"></div>
                  </div>
                  <span className="text-xs font-bold text-emerald-600">60%</span>
              </div>
          </div>

      </div>
    </>
  );
};

export default LearnerHomePage;