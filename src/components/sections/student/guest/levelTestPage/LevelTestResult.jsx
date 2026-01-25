import { motion } from 'framer-motion';
import { FaCheckCircle, FaHome } from 'react-icons/fa';

const LevelTestResult = ({ score, onRetakeTest }) => {
  const percentage = Math.round((score.correct / score.total) * 100);
  const estimatedScore = Math.round((score.correct / score.total) * 990);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-primary to-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaCheckCircle className="text-white text-5xl" />
          </div>

          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Hoàn Thành Bài Test!
          </h2>
          <p className="text-gray-600 mb-8">
            Chúc mừng bạn đã hoàn thành bài kiểm tra trình độ TOEIC
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6">
              <div className="text-blue-600 text-sm font-semibold mb-2">Tổng câu hỏi</div>
              <div className="text-4xl font-bold text-blue-700">{score.total}</div>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6">
              <div className="text-green-600 text-sm font-semibold mb-2">Câu trả lời đúng</div>
              <div className="text-4xl font-bold text-green-700">{score.correct}</div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6">
              <div className="text-purple-600 text-sm font-semibold mb-2">Tỷ lệ chính xác</div>
              <div className="text-4xl font-bold text-purple-700">{percentage}%</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-primary to-green-400 rounded-2xl p-8 mb-8 text-white">
            <div className="text-sm font-semibold mb-2 opacity-90">Điểm TOEIC ước tính</div>
            <div className="text-6xl font-bold mb-2">{estimatedScore}</div>
            <div className="text-sm opacity-90">/ 990 điểm</div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.location.href = '/'}
              className="bg-primary text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary-dark transition-all flex items-center justify-center gap-2"
            >
              <FaHome />
              Về Trang Chủ
            </button>
            <button
              onClick={onRetakeTest}
              className="bg-white border-2 border-primary text-primary px-8 py-3 rounded-xl font-semibold hover:bg-green-50 transition-all"
            >
              Làm Lại Bài Test
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LevelTestResult;
