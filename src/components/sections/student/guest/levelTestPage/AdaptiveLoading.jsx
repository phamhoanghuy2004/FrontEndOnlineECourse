import React from "react";
import { motion } from "framer-motion";

const AdaptiveLoading = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 bg-white/98 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center select-none"
    >
      <div className="max-w-md mx-auto space-y-8 flex flex-col items-center">
        
        {/* Animated Custom Ring Loader */}
        <div className="relative w-28 h-28 flex items-center justify-center">
          <motion.div
            className="absolute w-12 h-12 bg-emerald-500 rounded-full"
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.6, 0.3, 0.6]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.svg
            className="w-full h-full text-emerald-500"
            viewBox="0 0 100 100"
            animate={{ rotate: 360 }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="currentColor"
              strokeWidth="4"
              strokeDasharray="40 180"
              strokeLinecap="round"
              fill="transparent"
              className="opacity-90"
            />
          </motion.svg>
          <motion.svg
            className="absolute w-full h-full text-indigo-500"
            viewBox="0 0 100 100"
            animate={{ rotate: -360 }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <circle
              cx="50"
              cy="50"
              r="46"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="80 180"
              strokeLinecap="round"
              fill="transparent"
              className="opacity-55"
            />
          </motion.svg>
        </div>

        {/* Text Area */}
        <div className="space-y-3">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-2xl font-black text-gray-900 leading-snug"
          >
            Đang cá nhân hóa bài đánh giá...
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-sm sm:text-base text-gray-500 font-semibold leading-relaxed max-w-sm mx-auto"
          >
            Chúng tôi đang điều chỉnh câu hỏi để phù hợp với năng lực hiện tại của bạn.
          </motion.p>
        </div>

        {/* Tiny tag */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{
            delay: 0.6,
            duration: 2,
            repeat: Infinity,
            repeatDelay: 0.5
          }}
          className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider"
        >
          Hệ thống AI đang phân tích phản hồi
        </motion.div>

      </div>
    </motion.div>
  );
};

export default AdaptiveLoading;
