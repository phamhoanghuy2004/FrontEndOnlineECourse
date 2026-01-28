import { motion } from "framer-motion";
import { FaHeadSideVirus, FaBriefcase, FaLightbulb } from "react-icons/fa";
import Button from '../../../../common/Button';
import FeatureItem from "../../../../common/FeatureItem";
import HeroVisuals from "../../../../common/student/guest/home/HeroVisuals";
import { fadeInLeft, fadeInUp } from "../../../../../constants/motionVariants";
import Title from '../../../../common/Title';

const FEATURES = [
  { icon: FaHeadSideVirus, color: "text-yellow-500", label: "Phòng luyện nói với AI" },
  { icon: FaBriefcase, color: "text-orange-500", label: "Giảng viên trình độ cao" },
  { icon: FaLightbulb, color: "text-rose-500", label: "AI hỗ trợ chữa bài tập" },
];

const Intro = () => {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-b from-green-50 to-white">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center">
        {/* Left Content */}
        <motion.div
          variants={fadeInLeft}
          initial="hidden"
          animate="visible"
          className="md:w-1/2 space-y-8 z-10"
        >
          {/* Badge & Title */}
          <div className="space-y-4">
            <span className="text-primary font-bold tracking-wider uppercase text-sm bg-green-100 px-3 py-1 rounded-full">
              Echill online course
            </span>

            <Title
              text="Nâng Trình Tiếng Anh Mở Lối Tương Lai"
              as="h1"
              className="text-5xl md:text-6xl font-extrabold leading-tight text-gray-900"
              variants={fadeInUp} // Truyền hiệu ứng Fade In Up vào
            />

            <p className="text-gray-500 text-lg max-w-lg">
              Làm chủ tiếng Anh với hệ thống học tập hiện đại và kho tài liệu phong phú giúp bạn không ngừng phát triển.
            </p>
          </div>

          {/* Buttons Group */}
          <div className="flex gap-4 pt-2">
            <Button onClick={() => console.log("Gợi ý khóa học")}>
              Nhận gợi ý khóa học
            </Button>
            <Button
              variant="secondary"
              onClick={() => document.getElementById('steps').scrollIntoView({ behavior: 'smooth' })}
            >
              Khám phá ngay
            </Button>
          </div>

          {/* Features List (Dùng vòng lặp Map) */}
          <div className="pt-8 border-t border-gray-100 flex flex-wrap gap-6 lg:gap-8 items-center">
            {FEATURES.map((feature, index) => (
              <FeatureItem key={index} {...feature} />
            ))}
          </div>

        </motion.div>

        {/* --- RIGHT Content --- */}
        <HeroVisuals />

      </div>
    </section>
  );
};

export default Intro;