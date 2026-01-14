import { motion } from 'framer-motion';
import { FaClock, FaHeadphones, FaCheckCircle } from 'react-icons/fa';

const LevelTestLanding = ({ onStartTest }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="inline-block bg-blue-100 text-blue-600 px-4 py-2 rounded-full font-semibold text-sm">
              MIỄN PHÍ
            </div>
            
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight">
              Bài Test Trình Độ <span className="text-primary">TOEIC</span>
            </h1>

            <div className="space-y-4 text-gray-600">
              <p className="text-lg">
                Kiểm tra trình độ TOEIC <span className="font-bold text-gray-900">hoàn toàn miễn phí</span> chỉ trong <span className="font-bold text-primary">20 phút</span>
              </p>
              <p className="text-base">
                Ước lượng band điểm sát thực tế theo thang chuẩn ETS. Tiết kiệm và tăng tốc x3 lần bằng cách học đúng theo trình độ ngay từ ban đầu.
              </p>
            </div>

            <div className="space-y-3 pt-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <FaClock className="text-primary" />
                </div>
                <span className="text-gray-700 font-medium">20 phút hoàn thành</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <FaHeadphones className="text-primary" />
                </div>
                <span className="text-gray-700 font-medium">10 câu Listening + 10 câu Reading</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <FaCheckCircle className="text-primary" />
                </div>
                <span className="text-gray-700 font-medium">Kết quả ngay lập tức</span>
              </div>
            </div>

            <button
              onClick={onStartTest}
              className="mt-8 bg-primary text-white px-10 py-4 rounded-full font-bold text-lg shadow-xl shadow-primary/30 hover:bg-primary-dark transition-all transform hover:-translate-y-1 hover:shadow-2xl"
            >
              Bắt đầu bài test
            </button>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative w-full h-[500px] rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80"
                alt="TOEIC Test"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent"></div>
              
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute top-8 right-8 bg-white rounded-2xl p-4 shadow-xl"
              >
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">20</div>
                  <div className="text-sm text-gray-600">Phút</div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LevelTestLanding;
