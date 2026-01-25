import { motion } from "framer-motion";
import { FaChalkboardTeacher, FaVideo, FaHeadSideVirus, FaBriefcase, FaLightbulb } from "react-icons/fa";
import ProgressBadge from '../../../../common/ProgressBadge';
import StatBadge from '../../../../common/StatBadge';

const Intro = () => {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-b from-green-50 to-white">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="md:w-1/2 space-y-8 z-10"
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
          {/* HIGHLIGHT FEATURES --- */}
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
              className="absolute top-1/2 left-1/2 -translate-x-[52%] -translate-y-[52%] w-[105%] h-[105%] rounded-full border border-primary/40 z-0"
            ></motion.div>

            {/* LAYER 2: Vòng tròn nền xanh (Solid Green Circle) */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 bg-primary rounded-full z-0 shadow-2xl shadow-primary/30"
            ></motion.div>

            {/* LAYER 3: Ảnh /}
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
              />
            </motion.div>

            {/* LAYER 4: Các Badge nổi (Floating Elements) */}
            {/* Badge 1: 2K+ Video */}
            <StatBadge
              icon={FaVideo}
              amount="2K+"
              label="Video bài giảng"
              className="top-1/2 -left-24 transform -translate-y-1/2"
              animation={{
                animate: { y: [0, -10, 0] },
                transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
              }}
            />

            {/* Badge 2: 5K+ Khóa học */}
            <ProgressBadge
              amount="5K+"
              label="Khóa học"
              className="-top-10 -right-8"
              animation={{
                animate: { y: [0, 10, 0] },
                transition: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }
              }}
            />

            {/* Badge 3: Giáo viên 250+ */}
            <StatBadge
              icon={FaChalkboardTeacher}
              amount="250+"
              label="Giáo viên"
              className="bottom-4 -right-16"
              animation={{
                animate: { x: [0, 10, 0] }, // Cái này di chuyển theo trục X như bạn muốn
                transition: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Intro;