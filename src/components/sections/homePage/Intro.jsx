import { motion } from "framer-motion";
import { FaChalkboardTeacher, FaVideo, FaHeadSideVirus, FaBriefcase, FaLightbulb } from "react-icons/fa";

const Intro = () => {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-b from-green-50 to-white">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="md:w-1/2 space-y-8 z-10" // Tăng space-y-6 lên space-y-8 để thoáng hơn
        >
          {/* Badge & Title */}
          <div className="space-y-4">
            <span className="text-primary font-bold tracking-wider uppercase text-sm bg-green-100 px-3 py-1 rounded-full">
              Echill online course
            </span>
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-gray-900">
              Nâng trình <span className="text-primary">Tiếng Anh</span> <br />
              Mở lối <span className="text-primary">Tương Lai</span>
            </h1>
            <p className="text-gray-500 text-lg max-w-lg">
              Làm chủ tiếng Anh với hệ thống học tập hiện đại và kho tài liệu phong phú giúp bạn không ngừng phát triển.
            </p>
          </div>
          {/* Buttons Group */}
          <div className="flex gap-4 pt-2">
            <button className="bg-primary text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-primary/40 hover:bg-primary-dark transition transform hover:-translate-y-1">
              Nhận gợi ý khóa học
            </button>
            <button
              onClick={() => document.getElementById('steps').scrollIntoView({ behavior: 'smooth' })}
              className="bg-[#EAFFF9] text-primary px-8 py-3 rounded-full font-bold hover:bg-[#dbfbf3] transition transform hover:-translate-y-1"
            >
              Khám phá ngay
            </button>
          </div>
          {/* --- PHẦN MỚI THÊM: HIGHLIGHT FEATURES --- */}
          <div className="pt-8 border-t border-gray-100 flex flex-wrap gap-6 lg:gap-8 items-center">

            {/* Item 1: Luyện nói AI */}
            <div className="flex items-center gap-3">
              <FaHeadSideVirus className="text-yellow-500 text-2xl" />
              <span className="text-sm font-semibold text-gray-600">Phòng luyện nói với AI</span>
            </div>

            {/* Item 2: Giảng viên */}
            <div className="flex items-center gap-3">
              <FaBriefcase className="text-orange-500 text-2xl" />
              <span className="text-sm font-semibold text-gray-600">Giảng viên trình độ cao</span>
            </div>

            {/* Item 3: AI chữa bài */}
            <div className="flex items-center gap-3">
              <FaLightbulb className="text-rose-500 text-2xl" />
              <span className="text-sm font-semibold text-gray-600">AI hỗ trợ chữa bài tập</span>
            </div>
          </div>
        </motion.div>

        {/* Right Image area with Floating Elements */}
        <div className="md:w-1/2 relative mt-16 md:mt-0 flex justify-center items-center">
          <div className="relative w-[450px] h-[450px]">
            {/* LAYER 1: Viền cong bo mảnh */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              // Thay đổi chính nằm ở đây: w-[105%] và translate nhẹ hơn (-51%)
              className="absolute top-1/2 left-1/2 -translate-x-[52%] -translate-y-[52%] w-[105%] h-[105%] rounded-full border border-primary/40 z-0"
            ></motion.div>

            {/* LAYER 2: Vòng tròn nền xanh (Solid Green Circle) */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 bg-primary rounded-full z-0 shadow-2xl shadow-primary/30"
            ></motion.div>

            {/* LAYER 3: Ảnh cô gái (Hình tròn, nằm lọt trong nền xanh) */}
            {/* Lưu ý: w-[90%] để chừa lại viền xanh bao quanh giống thiết kế */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="absolute inset-0 flex items-end justify-center z-10 overflow-hidden rounded-full"
            >
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Student"
                className="w-[90%] h-[90%] object-cover rounded-full mb-4 border-4 border-white/20"
              // mb-4 để đẩy ảnh lên một chút cho cân đối
              />
            </motion.div>

            {/* LAYER 4: Các Badge nổi (Floating Elements) */}
            {/* Badge 1: 2K+ Video (Đẩy xa sang TRÁI) */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              // Cũ: -left-12 --> Mới: -left-24 (Đẩy xa hơn nữa)
              className="absolute top-1/2 -left-24 transform -translate-y-1/2 bg-white p-4 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] z-20 flex items-center gap-3 min-w-[200px]"
            >
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-primary text-xl">
                <FaVideo />
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-800">2K+</h4>
                <p className="text-sm text-gray-500 font-medium">Video bài giảng</p>
              </div>
            </motion.div>

            {/* Badge 2: 5K+ Khóa học (Đẩy cao lên trên và sang phải) */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              // Cũ: -top-6 -right-4 --> Mới: -top-10 -right-8 (Bay cao hơn, xa hơn)
              className="absolute -top-10 -right-8 bg-white p-5 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] z-20 text-center min-w-[140px]"
            >
              <div className="relative w-16 h-16 mx-auto mb-2">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="32" cy="32" r="28" stroke="#F3F4F6" strokeWidth="6" fill="none" />
                  <circle cx="32" cy="32" r="28" stroke="#34D399" strokeWidth="6" fill="none" strokeDasharray="175" strokeDashoffset="40" strokeLinecap="round" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-gray-800">5K+</h4>
              <p className="text-sm text-gray-500 font-medium">Khóa học</p>
            </motion.div>

            {/* Badge 3: Giáo viên 250+ (Đẩy thấp xuống và sang phải) */}
            <motion.div
              animate={{ x: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              // Cũ: bottom-10 -right-10 --> Mới: bottom-4 -right-16 (Hạ thấp xuống, đẩy xa phải)
              className="absolute bottom-4 -right-16 bg-white p-4 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] z-20 flex items-center gap-3 min-w-[180px]"
            >
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-primary text-2xl">
                <FaChalkboardTeacher />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Giáo viên</p>
                <h4 className="text-xl font-bold text-gray-800">250+</h4>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Intro;