import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2, RefreshCw, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import courseRecommendApi from "../../../../api/courseRecommendApi";
import BarChart from "../../../../components/sections/student/guest/levelTestPage/BarChart";

const PlacementLoadingPage = ({ onContinue }) => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [insightData, setInsightData] = useState(null);
  const [loadingData, setLoadingData] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  const fetchInsights = async () => {
    try {
      setLoadingData(true);
      setErrorMsg(null);
      const res = await courseRecommendApi.getSkillInsights();
      setInsightData(res.data);
    } catch (err) {
      console.error("Lỗi khi tải thông tin đánh giá:", err);
      const errorMsg = err.response?.data?.message || err.message || "Không thể kết nối đến máy chủ để tải thông tin đánh giá!";
      toast.error(errorMsg);
      if (window.history.length > 1) {
        navigate(-1);
      } else {
        navigate("/");
      }
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  useEffect(() => {
    const duration = 2400; // 2.4 seconds
    const intervalTime = 40;
    const steps = duration / intervalTime;
    const increment = 100 / steps;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
          return 100;
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  const isCalculated = progress >= 100;
  const isReady = isCalculated && !loadingData && insightData;

  const handleAction = () => {
    navigate("/course-recommendations");
  };

  return (
    <div className="min-h-screen w-full bg-gray-50/50 py-16 px-4 sm:px-6 flex items-center justify-center pt-24 select-none">
      <div className="w-full max-w-4xl space-y-10 flex flex-col items-center">
        
        {/* Top Success Header */}
        <div className="text-center space-y-4 max-w-lg mx-auto">
          <motion.div
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
            className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto border border-emerald-100 shadow-sm"
          >
            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
          </motion.div>

          <div className="space-y-2">
            <h1 className="text-3xl font-black text-gray-900 leading-tight">
              Hoàn thành đánh giá!
            </h1>
            <p className="text-sm sm:text-base text-gray-500 font-semibold leading-relaxed">
              Chúng tôi đang phân tích kết quả để xây dựng lộ trình học phù hợp nhất dành cho bạn.
            </p>
          </div>
        </div>

        {/* Live progress status */}
        <div className="w-full max-w-xs space-y-2 text-center">
          <div className="flex justify-between text-xs font-bold text-gray-500">
            <span>Tiến trình phân tích</span>
            <span className="tabular-nums">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200/70 h-2 rounded-full overflow-hidden">
            <motion.div
              className="bg-emerald-500 h-full rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-[10px] text-gray-400 font-bold flex items-center justify-center gap-1">
            {!isCalculated ? (
              <>
                <Loader2 className="w-3.5 h-3.5 text-emerald-500 animate-spin" />
                Đang xử lý kỹ năng và điểm yếu...
              </>
            ) : loadingData ? (
              <>
                <Loader2 className="w-3.5 h-3.5 text-emerald-500 animate-spin" />
                Đang tải dữ liệu phân tích chi tiết...
              </>
            ) : errorMsg ? (
              <span className="text-red-500">Lỗi: {errorMsg}</span>
            ) : (
              "Đã hoàn thành tính toán dữ liệu!"
            )}
          </div>
        </div>

        {/* Dashboard Mockup / Results */}
        <div className="w-full bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm relative overflow-hidden">
          <AnimatePresence mode="wait">
            {!isReady ? (
              <motion.div
                key="skeleton"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-12 gap-8 relative"
              >
                <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px] z-10 pointer-events-none"></div>

                {/* Left Skeleton Column: Bar Chart representation */}
                <div className="md:col-span-5 flex flex-col justify-end space-y-4 h-48 pb-2">
                  <div className="w-full flex items-end justify-around h-full border-b border-gray-200 pb-2">
                    {[60, 80, 45, 90].map((h, idx) => (
                      <div key={idx} className="w-8 bg-gray-200 rounded-t-lg animate-pulse" style={{ height: `${h}%` }}></div>
                    ))}
                  </div>
                </div>

                {/* Right Skeleton Column: Skills list */}
                <div className="md:col-span-7 space-y-6">
                  <div className="space-y-3">
                    <div className="h-5 w-48 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="h-3.5 w-full bg-gray-100 rounded-full animate-pulse"></div>
                    <div className="h-3.5 w-4/5 bg-gray-100 rounded-full animate-pulse"></div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border border-gray-100 rounded-xl p-4 space-y-3">
                      <div className="flex justify-between">
                        <div className="w-8 h-8 rounded-lg bg-gray-200 animate-pulse"></div>
                        <div className="w-14 h-4 bg-gray-200 rounded-full animate-pulse"></div>
                      </div>
                      <div className="h-3 w-full bg-gray-100 rounded-full animate-pulse"></div>
                      <div className="h-3 w-2/3 bg-gray-100 rounded-full animate-pulse"></div>
                    </div>
                    <div className="border border-gray-100 rounded-xl p-4 space-y-3">
                      <div className="flex justify-between">
                        <div className="w-8 h-8 rounded-lg bg-gray-200 animate-pulse"></div>
                        <div className="w-14 h-4 bg-gray-200 rounded-full animate-pulse"></div>
                      </div>
                      <div className="h-3 w-full bg-gray-100 rounded-full animate-pulse"></div>
                      <div className="h-3 w-2/3 bg-gray-100 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="real-results"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center"
              >
                {/* Left Column: Real BarChart */}
                <div className="md:col-span-5 flex flex-col items-center justify-center">
                  <BarChart skills={insightData.skills} />
                </div>

                {/* Right Column: AI Analytical Remarks */}
                <div className="md:col-span-7 space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                        Báo cáo năng lực
                      </span>
                      <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                        Điểm tổng quan: {insightData.overallScore}/100
                      </span>
                    </div>
                    <h2 className="font-extrabold text-gray-900 text-xl">
                      Đánh giá từ Hệ thống AI
                    </h2>
                    <div className="mt-4 p-6 bg-gradient-to-br from-emerald-50 via-white to-teal-50/30 border border-emerald-100 rounded-3xl shadow-sm relative overflow-hidden">
                      {/* Decorative radial glows */}
                      <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none"></div>
                      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-teal-400/10 rounded-full blur-2xl pointer-events-none"></div>

                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 p-3 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl text-white shadow-md shadow-emerald-200/50">
                          <Sparkles className="w-5 h-5 text-white animate-pulse" />
                        </div>
                        
                        <div className="space-y-1.5 flex-1 text-left">
                          <h4 className="text-xs font-black text-emerald-800 uppercase tracking-widest flex items-center gap-1.5">
                            ĐÁNH GIÁ CHUYÊN SÂU TỪ HỆ THỐNG AI
                          </h4>
                          <p className="text-slate-800 text-sm sm:text-base font-bold leading-relaxed italic">
                            "{insightData.motivationalRemark}"
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Proceed Action Button */}
        <div className="h-14">
          <AnimatePresence>
            {isReady ? (
              <motion.button
                key="btn-result"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                onClick={handleAction}
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 px-10 rounded-2xl cursor-pointer shadow-lg shadow-emerald-200/50 hover:shadow-xl transition-all"
              >
                Nhận gợi ý
              </motion.button>
            ) : errorMsg && isCalculated ? (
              <motion.button
                key="btn-retry"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={fetchInsights}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-3.5 px-8 rounded-2xl cursor-pointer shadow-lg flex items-center gap-2 transition-all animate-pulse"
              >
                <RefreshCw className="w-4 h-4 animate-spin" />
                Thử lại
              </motion.button>
            ) : null}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};

export default PlacementLoadingPage;
