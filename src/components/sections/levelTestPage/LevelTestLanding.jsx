import React from 'react';
import { motion } from 'framer-motion';
import { FaClock, FaHeadphones, FaCheckCircle } from 'react-icons/fa';

const LevelTestLanding = ({ onStartTest }) => {
  return (
    // 1. pt-24: Đẩy nội dung xuống dưới để tránh Navbar
    // 2. h-screen: Giữ chiều cao bằng đúng màn hình
    <div className="h-screen w-full bg-gradient-to-br from-blue-50 via-white to-blue-50 overflow-hidden flex flex-col justify-center pt-24 relative">
      
      {/* 3. max-w-7xl: Mở rộng khung chứa để nội dung dãn ra 2 bên nhiều hơn */}
      <div className="container mx-auto px-6 max-w-7xl h-full flex items-center">
        
        {/* 4. gap-16 lg:gap-24: Tăng khoảng cách giữa Text và Ảnh để chúng xa nhau ra */}
        <div className="grid md:grid-cols-2 gap-16 lg:gap-24 items-center w-full">
          
          {/* --- LEFT CONTENT --- */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col justify-center space-y-5"
          >
            <div>
                <span className="inline-block bg-blue-100 text-blue-600 px-3 py-1.5 rounded-full font-bold text-xs uppercase tracking-wide">
                Miễn phí
                </span>
            </div>
            
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-extrabold text-gray-900 leading-tight">
              Bài Test Trình Độ <br />
              <span className="text-primary">TOEIC</span>
            </h1>

            <div className="space-y-3 text-gray-600">
              <p className="text-base lg:text-lg">
                Kiểm tra trình độ TOEIC <span className="font-bold text-gray-900">hoàn toàn miễn phí</span> chỉ trong <span className="font-bold text-primary">20 phút</span>.
              </p>
              <p className="text-sm lg:text-base leading-relaxed max-w-lg">
                Ước lượng band điểm sát thực tế theo thang chuẩn ETS. Tiết kiệm và tăng tốc x3 lần bằng cách học đúng theo trình độ ngay từ ban đầu.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <FeatureItem icon={FaClock} text="20 phút hoàn thành" />
              <FeatureItem icon={FaHeadphones} text="10 câu Listening + 10 câu Reading" />
              <FeatureItem icon={FaCheckCircle} text="Kết quả ngay lập tức" />
            </div>

            <div className="pt-4">
                <button
                onClick={onStartTest}
                className="bg-primary hover:bg-emerald-600 text-white px-8 py-3.5 rounded-full font-bold text-lg shadow-lg shadow-primary/30 transition-all transform hover:-translate-y-1 hover:shadow-xl flex items-center gap-2"
                >
                Bắt đầu bài test
                </button>
            </div>
          </motion.div>

          {/* --- RIGHT IMAGE --- */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative h-full flex items-center justify-center md:justify-end" // Đẩy ảnh về phía bên phải
          >
            {/* 5. max-w-sm: Giới hạn chiều rộng ảnh nhỏ lại (Size Small) */}
            <div className="relative w-full max-w-sm lg:max-w-md aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80"
                alt="TOEIC Test"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent pointer-events-none"></div>
              
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg text-center"
              >
                <div className="text-3xl font-black text-primary leading-none">20</div>
                <div className="text-xs font-bold text-gray-500 uppercase mt-1">Phút</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const FeatureItem = ({ icon: Icon, text }) => (
    <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Icon className="text-primary text-sm" />
        </div>
        <span className="text-gray-700 font-medium text-sm lg:text-base">{text}</span>
    </div>
);

export default LevelTestLanding;