import { motion } from "framer-motion";
import {
  FaPlayCircle,
  FaFileAlt,
  FaClipboardCheck,
} from "react-icons/fa";

const LessonSection = ({
  lesson,
  courseTag,
  lessonIndex = 1,
  isTrial = false,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
    >
      {/* ===== Header ===== */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-8 py-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <FaPlayCircle className="text-primary" />
          {isTrial ? "Học thử miễn phí" : "Bài học"}
        </h2>

        <span className="bg-white/10 text-white px-3 py-1 rounded-full text-xs font-semibold">
          Lesson {lessonIndex}
        </span>
      </div>

      {/* ===== Content ===== */}
      <div className="p-8">
        {/* Lesson info */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Bài {lessonIndex}: {courseTag} Foundation
          </h3>
          <p className="text-gray-600">
            {lesson?.description ||
              "Nội dung chi tiết của bài học sẽ được cập nhật."}
          </p>
        </div>

        {/* ===== Video Player ===== */}
        <div className="relative pt-[56.25%] bg-black rounded-2xl overflow-hidden shadow-lg mb-8">
          {lesson?.video ? (
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={lesson.video}
              title="Lesson Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
              <FaPlayCircle size={64} />
              <p className="mt-4">Video chưa có</p>
            </div>
          )}
        </div>

        {/* ===== Resources ===== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Document */}
          <a
            href={lesson?.document || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 rounded-xl bg-blue-50 border border-blue-100 text-blue-800 hover:bg-blue-100 transition group"
          >
            <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center group-hover:scale-110 transition">
              <FaFileAlt />
            </div>
            <div>
              <h4 className="font-bold text-sm">Tài liệu học tập</h4>
              <p className="text-xs text-blue-600">
                PDF, slide bài giảng
              </p>
            </div>
          </a>

          {/* Practice test */}
          <a
            href={lesson?.test || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 rounded-xl bg-orange-50 border border-orange-100 text-orange-800 hover:bg-orange-100 transition group"
          >
            <div className="w-10 h-10 rounded-full bg-orange-200 flex items-center justify-center group-hover:scale-110 transition">
              <FaClipboardCheck />
            </div>
            <div>
              <h4 className="font-bold text-sm">Bài tập thực hành</h4>
              <p className="text-xs text-orange-600">
                Mini test 15 phút
              </p>
            </div>
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default LessonSection;
